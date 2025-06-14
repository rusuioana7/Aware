from fastapi import APIRouter, HTTPException, Path, Query
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


@router.get(
    "/topics/{topics}/articles",
    response_model=List[Article],
    summary="List articles by one or more topics",
)
async def list_by_topic(
        topics: str = Path(
            ...,
            description="Comma-separated list of topics to filter on, e.g. 'tech,science'",
        ),
        page: int = Query(1, ge=1),
        size: int = Query(20, ge=1, le=100),
):
    topic_list = [t.strip() for t in topics.split(",") if t.strip()]
    skip = (page - 1) * size

    cursor = (
        articles_col
        .find({"topic": {"$in": topic_list}})
        .sort("published", -1)
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
) -> FeedResponse:
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

        art_cursor = (
            articles_col
            .find(art_q)
            .sort("published", -1)
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

        result.articles = [Article.model_validate(d) for d in docs]

    # --- THREADS ---
    if feed_type in ("threads", "both"):
        art_q: dict = {}
        if topics:
            tlist = [t.strip() for t in topics.split(",") if t.strip()]
            art_q["topic"] = {"$in": tlist}
        if languages:
            lang_list = [l.strip() for l in languages.split(",") if l.strip()]
            art_q["language"] = {"$in": lang_list}

        art_ids_cursor = articles_col.find(art_q, {"_id": 1})
        art_id_docs = await art_ids_cursor.to_list(None)
        art_ids = [doc["_id"] for doc in art_id_docs]

        thr_cursor = (
            threads_col
            .find({"articles": {"$in": art_ids}})
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

    return result
