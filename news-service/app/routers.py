from fastapi import APIRouter, HTTPException, Path, Query, status
from typing import List, Optional
from bson import ObjectId
from datetime import datetime
from app.models import Article, CrawlResponse, FeedResponse, Thread
from app.database import articles_col, threads_col
from app.crawler import crawl_and_process

router = APIRouter()


@router.post("/crawl", response_model=CrawlResponse)
async def trigger_crawl():
    count = await crawl_and_process()
    return {"success": True, "crawled": count}


@router.get("/articles/{id}", response_model=Article)
async def get_article(id: str):
    try:
        oid = ObjectId(id)
    except Exception:
        raise HTTPException(status_code=400, detail="invalid article id")

    doc = await articles_col.find_one({"_id": oid})
    if not doc:
        raise HTTPException(status_code=404, detail="Not found")

    doc['views'] = doc.get('views', 0)

    doc['commentsCount'] = doc.get('commentsCount', 0)

    doc["credibility_label"] = doc.get("credibility_label", "unrated")

    pub = doc.get("published")
    if isinstance(pub, datetime):
        doc["published"] = pub.isoformat()

    if "topics" not in doc:
        t = doc.get("topic")
        doc["topics"] = [t] if t else []

    thr_doc = await threads_col.find_one({"articles": oid})
    if thr_doc:
        thr_doc["_id"] = str(thr_doc["_id"])
        thr_doc["articles"] = [str(a) for a in thr_doc.get("articles", [])]

        lu = thr_doc.get("last_updated")
        if isinstance(lu, datetime):
            thr_doc["last_updated"] = lu.isoformat()

        thr_doc["language"] = thr_doc.get("language", "en")

        if thr_doc["articles"]:
            first_oid = ObjectId(thr_doc["articles"][0])
            art = await articles_col.find_one(
                {"_id": first_oid},
                {"image": 1, "topics": 1, "topic": 1}
            )
            if art:
                thr_doc["image"] = art.get("image")
                topics = art.get("topics") or ([art.get("topic")] if art.get("topic") else [])
                thr_doc["topic"] = topics[0] if topics else None

        doc["thread"] = thr_doc
    else:
        doc["thread"] = None

    return doc


@router.get(
    "/threads/{thread_id}",
    response_model=Thread,
    summary="Get metadata for a single thread"
)
async def get_thread(
        thread_id: str = Path(..., description="Either the integer cluster ID or a Mongo ObjectId")
):
    if thread_id.isdigit():
        query = {"_id": int(thread_id)}
    else:
        try:
            oid = ObjectId(thread_id)
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid thread ID format")
        query = {"_id": oid}

    thr_doc = await threads_col.find_one(query)
    if not thr_doc:
        raise HTTPException(status_code=404, detail="Thread not found")

    thr_doc["language"] = thr_doc.get("language", "en")
    lu = thr_doc.get("last_updated")
    if isinstance(lu, datetime):
        thr_doc["last_updated"] = lu.isoformat()
    thr_doc["_id"] = str(thr_doc["_id"])
    thr_doc["articles"] = [str(a) for a in thr_doc.get("articles", [])]

    if thr_doc["articles"]:
        first_oid = ObjectId(thr_doc["articles"][0])
        art = await articles_col.find_one(
            {"_id": first_oid},
            {"image": 1, "topics": 1, "topic": 1}
        )
        if art:
            thr_doc["image"] = art.get("image")
            topics = art.get("topics") or ([art.get("topic")] if art.get("topic") else [])
            thr_doc["topic"] = topics[0] if topics else None

    return Thread.model_validate(thr_doc)


@router.delete(
    "/articles/{id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a single article by its ObjectId"
)
async def delete_article(id: str = Path(..., description="Mongo ObjectId of the article")):
    try:
        oid = ObjectId(id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid article id")

    result = await articles_col.delete_one({"_id": oid})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Article not found")
    return


@router.delete(
    "/threads/{thread_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a single thread by its ObjectId or integer ID"
)
async def delete_thread(
        thread_id: str = Path(..., description="Either integer cluster ID or Mongo ObjectId")
):
    if thread_id.isdigit():
        query = {"_id": int(thread_id)}
    else:
        try:
            oid = ObjectId(thread_id)
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid thread ID format")
        query = {"_id": oid}

    result = await threads_col.delete_one(query)
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Thread not found")

    return


@router.get(
    "/threads/{thread_id}/related",
    response_model=List[Thread],
    summary="Get up to 4 threads whose titles match this one (fallback to same topic)"
)
async def get_related_threads(
        thread_id: str = Path(..., description="Mongo ObjectId of the thread"),
        max_results: int = Query(4, ge=1, le=10, description="Maximum number of related threads")
):
    try:
        base_oid = ObjectId(thread_id)
    except Exception:
        raise HTTPException(400, detail="Invalid thread ID format")
    base = await threads_col.find_one({"_id": base_oid})
    if not base:
        raise HTTPException(404, detail="Thread not found")

    base["_id"] = str(base["_id"])
    base["articles"] = [str(a) for a in base.get("articles", [])]
    if isinstance(base.get("last_updated"), datetime):
        base["last_updated"] = base["last_updated"].isoformat()

    related = await threads_col.find(
        {"$text": {"$search": base["title"]}, "_id": {"$ne": base_oid}}
    ).limit(max_results).to_list(length=max_results)

    if len(related) < max_results:
        topic = base.get("topic")
        if not topic and base["articles"]:
            art = await articles_col.find_one(
                {"_id": ObjectId(base["articles"][0])},
                {"topics": 1}
            )
            topic = (art.get("topics") or [None])[0] if art else None

        if topic:
            more = await threads_col.find(
                {"_id": {"$ne": base_oid}, "topic": topic}
            ).limit(max_results - len(related)).to_list(length=max_results)
            related.extend(more)

    output: List[Thread] = []
    for doc in related:
        doc["_id"] = str(doc["_id"])
        doc["articles"] = [str(a) for a in doc.get("articles", [])]
        lu = doc.get("last_updated")
        if isinstance(lu, datetime):
            doc["last_updated"] = lu.isoformat()
        output.append(Thread.model_validate(doc))
    return output


@router.get(
    "/topics/{topics}/articles",
    response_model=List[Article],
    summary="List articles by one or more topics",
)
async def list_by_topic(
        topics: str = Path(..., description="Comma-separated topics"),
        page: int = Query(1, ge=1),
        size: int = Query(20, ge=1, le=100),
        sort: str = Query("published", description="Sort by 'published' or 'views'")
):
    topic_list = [t.strip() for t in topics.split(",") if t.strip()]
    skip = (page - 1) * size
    order_field = sort if sort in ("published", "views") else "published"

    cursor = (
        articles_col
        .find({"topic": {"$in": topic_list}})
        .sort(order_field, -1)
        .skip(skip)
        .limit(size)
    )
    docs = await cursor.to_list(length=size)

    for doc in docs:
        pub = doc.get("published")
        if isinstance(pub, datetime):
            doc["published"] = pub.isoformat()
        if "topics" not in doc:
            t = doc.get("topic")
            doc["topics"] = [t] if t else []
    return docs


@router.get(
    "/feed",
    response_model=FeedResponse,
    summary="Get a paginated feed of articles and/or threads",
)
async def get_feed(
        *,
        feed_type: str = Query(
            "both",
            regex="^(articles|threads|both)$",
            description="Return only `articles`, only `threads`, or `both`",
        ),
        topics: Optional[str] = Query(
            None,
            description="Comma-separated list of topics, e.g. 'tech,science'; omit for all",
        ),
        languages: Optional[str] = Query(None, description="Comma-separated lang codes, e.g. 'en,fr'"),
        page: int = Query(1, ge=1),
        size: int = Query(20, ge=1, le=100),
        sort: Optional[str] = Query("published", description="Sort by 'published' or 'views'"),
) -> FeedResponse:
    global count_articles
    skip = (page - 1) * size
    result = FeedResponse()

    # --- ARTICLES ---
    if feed_type in ("articles", "both"):
        art_q: dict = {}
        if topics:
            tlist = [t.strip() for t in topics.split(",") if t.strip()]
            art_q["topic"] = {"$in": tlist}
        if languages:
            lang_list = [l.strip() for l in languages.split(",") if l.strip()]
            art_q["language"] = {"$in": lang_list}
        order_field = sort if sort in ("published", "views") else "published"

        art_cursor = (
            articles_col
            .find(art_q)
            .sort(order_field, -1)
            .skip(skip)
            .limit(size)
        )
        docs = await art_cursor.to_list(length=size)

        for d in docs:
            d["_id"] = str(d["_id"])
            if isinstance(d.get("published"), datetime):
                d["published"] = d["published"].isoformat()
            if "topics" not in d:
                d["topics"] = [d.get("topic")] if d.get("topic") else []
            if "thread_id" in d:
                d["thread_id"] = str(d["thread_id"])
            if isinstance(d.get("fetched_at"), datetime):
                d["fetched_at"] = d["fetched_at"].isoformat()
            d["credibility_label"] = d.get("credibility_label", "unrated")

            d["thread"] = None

        result.articles = [Article.model_validate(d) for d in docs]

    # --- THREADS ---
    if feed_type in ("threads", "both"):
        art_q: dict = {}
        if topics:
            tlist = [t.strip() for t in topics.split(",") if t.strip()]
            art_q["topic"] = {"$in": tlist}

        lang_list = []
        if languages:
            lang_list = [l.strip() for l in languages.split(",") if l.strip()]
            art_q["language"] = {"$in": lang_list}

        art_ids_cursor = articles_col.find(art_q, {"_id": 1})
        art_id_docs = await art_ids_cursor.to_list(None)
        art_ids = [doc["_id"] for doc in art_id_docs]

        thr_q = {
            "articles": {"$in": art_ids},
            "$expr": {"$gte": [{"$size": "$articles"}, 2]},
        }
        if lang_list:
            thr_q["languages"] = {"$in": lang_list}

        thr_cursor = (
            threads_col
            .find(thr_q)
            .sort("last_updated", -1)
            .skip(skip)
            .limit(size)
        )
        ths = await thr_cursor.to_list(length=size)

        for t in ths:
            t["_id"] = str(t["_id"])
            if isinstance(t.get("last_updated"), datetime):
                t["last_updated"] = t["last_updated"].isoformat()
            t["language"] = t.get("language", "en")
            t["articles"] = [str(a) for a in t.get("articles", [])]

        result.threads = [Thread.model_validate(t) for t in ths]
    if feed_type == "articles":
        result.threads = []
    elif feed_type == "threads":
        result.articles = []
    return result


@router.post("/articles/{id}/track-view")
async def track_article_view(id: str):
    try:
        oid = ObjectId(id)
    except:
        raise HTTPException(400, "Invalid article ID")

    await articles_col.update_one({"_id": oid}, {"$inc": {"views": 10}})
    return {"success": True}


@router.patch("/articles/{id}/comments-count")
async def update_comments_count(id: str, payload: dict):
    try:
        oid = ObjectId(id)
    except Exception:
        raise HTTPException(status_code=400, detail="invalid article id")

    count = payload.get("count")
    if not isinstance(count, int):
        raise HTTPException(status_code=400, detail="invalid count (must be int)")

    result = await articles_col.update_one({"_id": oid}, {"$set": {"commentsCount": count}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Article not found")

    return {"success": True, "updated": result.modified_count}


@router.get("/search", response_model=FeedResponse)
async def search_items(
        q: str = Query(..., description="Search query string"),
        view: str = Query("both", pattern="^(articles|threads|both)$"),
        sort: str = Query("published", description="Sort by 'published' or 'views'"),
        page: int = Query(1, ge=1),
        size: int = Query(20, ge=1, le=100)
):
    skip = (page - 1) * size
    result = FeedResponse()
    article_map: dict[str, dict] = {}

    # --- ARTICLES ---
    art_docs = []
    if view in ("articles", "both", "threads"):
        art_cursor = (
            articles_col.find({"$text": {"$search": q}})
            .sort(sort if sort in ("published", "views") else "published", -1)
            .skip(skip)
            .limit(size)
        )
        art_docs = await art_cursor.to_list(length=size)

        for d in art_docs:
            d["_id"] = str(d["_id"])
            d["published"] = d.get("published").isoformat() if isinstance(d.get("published"), datetime) else None
            d["topics"] = d.get("topics") or ([d.get("topic")] if d.get("topic") else [])
            d["views"] = d.get("views", 0)
            d["commentsCount"] = d.get("commentsCount", 0)
            d["thread"] = None
            if "thread_id" in d:
                d["thread_id"] = str(d["thread_id"])
            if isinstance(d.get("fetched_at"), datetime):
                d["fetched_at"] = d["fetched_at"].isoformat()
            d["credibility_label"] = d.get("credibility_label", "unrated")

            article_map[d["_id"]] = d

        result.articles = [Article.model_validate(d) for d in art_docs]

    # --- THREADS ---
    if view in ("threads", "both"):
        thr_cursor = (
            threads_col.find({"$text": {"$search": q}})
            .sort("last_updated", -1)
            .skip(skip)
            .limit(size)
        )
        thr_docs = await thr_cursor.to_list(length=size)

        missing_ids = []
        for t in thr_docs:
            for aid in t.get("articles", []):
                if str(aid) not in article_map:
                    try:
                        missing_ids.append(ObjectId(aid))
                    except Exception:
                        continue

        if missing_ids:
            missing_docs = await articles_col.find({"_id": {"$in": missing_ids}}).to_list(length=None)
            for d in missing_docs:
                d["_id"] = str(d["_id"])
                d["published"] = d.get("published").isoformat() if isinstance(d.get("published"), datetime) else None
                d["topics"] = d.get("topics") or ([d.get("topic")] if d.get("topic") else [])
                d["views"] = d.get("views", 0)
                d["commentsCount"] = d.get("commentsCount", 0)
                d["credibility_label"] = d.get("credibility_label", "unrated")
                d["thread"] = None
                article_map[d["_id"]] = d
                result.articles.append(Article.model_validate(d))

        threads = []
        for t in thr_docs:
            t["_id"] = str(t["_id"])
            t["language"] = t.get("language", "en")
            t["last_updated"] = t.get("last_updated").isoformat() if isinstance(t.get("last_updated"),
                                                                                datetime) else None
            t["articles"] = [str(aid) for aid in t.get("articles", [])]

            if t["articles"]:
                first = article_map.get(t["articles"][0])
                if first:
                    t["image"] = first.get("image")
                    topics = first.get("topics") or ([first.get("topic")] if first.get("topic") else [])
                    t["topic"] = topics[0] if topics else None

            threads.append(Thread.model_validate(t))

        result.threads = threads

    return result
