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

    return doc


@router.get(
    "/threads/{thread_id}",
    response_model=Thread,
    summary="Get metadata for a single thread"
)
async def get_thread(thread_id: str):
    try:
        tid = ObjectId(thread_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid thread ID")

    thr = await threads_col.find_one({"_id": tid})
    if not thr:
        raise HTTPException(status_code=404, detail="Thread not found")

    if "language" not in thr:
        thr["language"] = "en"

    lu = thr.get("last_updated")
    if isinstance(lu, datetime):
        thr["last_updated"] = lu.isoformat()

    return thr


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
        feed_type: str = Query(
            "both",
            regex="^(articles|threads|both)$",
            description="Return only `articles`, only `threads`, or `both`",
        ),
        topics: Optional[str] = Query(
            None,
            description="Comma-separated list of topics, e.g. 'tech,science'; omit for all",
        ),
        language: Optional[str] = Query(
            None,
            description="Language code to filter, e.g. 'en','ro','fr'",
        ),
        page: int = Query(1, ge=1),
        size: int = Query(20, ge=1, le=100),
):
    skip = (page - 1) * size
    result = FeedResponse()

    # --- ARTICLES ---
    if feed_type in ("articles", "both"):
        art_q = {}
        if topics:
            tlist = [t.strip() for t in topics.split(",") if t.strip()]
            art_q["topic"] = {"$in": tlist}
        if language:
            art_q["language"] = language

        art_cursor = (
            articles_col
            .find(art_q)
            .sort("published", -1)
            .skip(skip)
            .limit(size)
        )
        docs = await art_cursor.to_list(length=size)

        for d in docs:
            if isinstance(d.get("published"), datetime):
                d["published"] = d["published"].isoformat()
            if "topics" not in d:
                t = d.get("topic")
                d["topics"] = [t] if t else []
            d["_id"] = str(d["_id"])
            if "thread_id" in d:
                d["thread_id"] = str(d["thread_id"])

        result.articles = [Article.model_validate(d) for d in docs]

    # --- THREADS ---
    if feed_type in ("threads", "both"):
        # First find matching article IDs
        art_q = {}
        if topics:
            tlist = [t.strip() for t in topics.split(",") if t.strip()]
            art_q["topic"] = {"$in": tlist}
        if language:
            art_q["language"] = language

        art_ids = await articles_col.find(art_q, {"_id": 1}).to_list(None)
        ids = [d["_id"] for d in art_ids]

        thr_cursor = (
            threads_col
            .find({"articles": {"$in": ids}})
            .sort("last_updated", -1)
            .skip(skip)
            .limit(size)
        )
        ths = await thr_cursor.to_list(length=size)

        for t in ths:
            if isinstance(t.get("last_updated"), datetime):
                t["last_updated"] = t["last_updated"].isoformat()
            if "language" not in t:
                t["language"] = "en"
            t["_id"] = str(t["_id"])
            t["articles"] = [str(a) for a in t.get("articles", [])]

        result.threads = [Thread.model_validate(t) for t in ths]

    return result
