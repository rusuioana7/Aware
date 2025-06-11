from fastapi import APIRouter, HTTPException, Path, Query
from typing import List, Optional
from bson import ObjectId
from datetime import datetime
from app.models import Article, CrawlResponse
from app.database import articles_col
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
    response_model=List[Article],
    summary="Get a paginated feed, filtered by topics and/or language",
)
async def get_feed(
        topics: Optional[str] = Query(
            None,
            description="Comma-separated list of topics, e.g. 'tech,science'; omit to get all topics",
        ),
        language: Optional[str] = Query(
            None,
            description="Optional language code to filter on, e.g. 'en', 'ro', 'fr'",
        ),
        page: int = Query(1, ge=1),
        size: int = Query(20, ge=1, le=100),
):
    query: dict = {}

    if topics:
        topic_list = [t.strip() for t in topics.split(",") if t.strip()]
        query["topic"] = {"$in": topic_list}

    if language:
        query["language"] = language

    skip = (page - 1) * size
    cursor = (
        articles_col
        .find(query)
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
