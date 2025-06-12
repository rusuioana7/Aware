import os
import json
import time
import feedparser
from datetime import datetime
from dateutil import parser as date_parser
from newspaper import Article as NewsArticle
from langdetect import detect, DetectorFactory
from typing import Tuple
from dotenv import load_dotenv

from openai import AsyncOpenAI
from app.thread_assigner import assigner
from app.database import articles_col, threads_col
from app.config import RSS_SOURCES, MAX_ARTICLES_PER_SOURCE, DELAY, TOPICS

load_dotenv()

client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))
DetectorFactory.seed = 0


async def process_article_via_llm(
        raw_content: str,
        raw_description: str
) -> Tuple[str, str, str]:
    system = {
        "role": "system",
        "content": (
            "You are an assistant that takes raw news article text and a raw summary, "
            "then outputs a JSON object with exactly three keys: "
            "`content`, `description`, and `topic`. "
            "- `content`: cleaned article body, free of cookie banners, duplicates, ads, and boilerplate. "
            "- `description`: a concise 1–2 sentence summary. "
            "- `topic`: exactly one of the provided topics matching the main theme."
        )
    }
    user = {
        "role": "user",
        "content": (
                f"Available topics: {TOPICS}\n\n"
                "Raw article text (first 3000 chars):\n"
                "```\n" + raw_content[:3000] + "\n```\n\n"
                                               "Raw description (if any):\n"
                                               "```\n" + (raw_description or "")[:500] + "\n```\n\n"
                                                                                         "Respond **only** with a valid JSON object, e.g.:\n"
                                                                                         "{\n"
                                                                                         '  "content": "…cleaned text…",\n'
                                                                                         '  "description": "…short summary…",\n'
                                                                                         '  "topic": "tech"\n'
                                                                                         "}"
        )
    }

    resp = await client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[system, user],
        temperature=0.0,
        max_tokens=2000
    )
    out = resp.choices[0].message.content.strip()
    try:
        data = json.loads(out)
        return data["content"], data["description"], data["topic"]
    except json.JSONDecodeError:
        return raw_content, raw_description or "", ""


async def translate_to_english(text: str) -> str:
    resp = await client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a translator to English."},
            {"role": "user", "content": f"Translate into English:\n\n{text}"}
        ],
        temperature=0.0,
        max_tokens=2000
    )
    return resp.choices[0].message.content.strip()


async def crawl_and_process() -> int:
    total = 0
    for src in RSS_SOURCES:
        entries = feedparser.parse(src["feedUrl"]).entries[:MAX_ARTICLES_PER_SOURCE]
        for entry in entries:
            url = entry.link
            if await articles_col.find_one({"url": url}):
                continue

            try:
                art = NewsArticle(url)
                art.download();
                art.parse()
            except:
                continue

            raw_content = art.text or ""
            raw_desc = entry.get("summary") or ""

            try:
                lang = detect(raw_content)
            except:
                lang = "unknown"

            published = None
            if getattr(entry, "published_parsed", None):
                published = datetime.fromtimestamp(time.mktime(entry.published_parsed))
            elif entry.get("published"):
                try:
                    published = date_parser.parse(entry.published)
                except:
                    pass

            clean_content, clean_desc, topic = await process_article_via_llm(raw_content, raw_desc)

            if lang != "en":
                content_en = await translate_to_english(clean_content)
            else:
                content_en = clean_content

            thread_id = await assigner.assign(content_en)

            doc = {
                "url": url,
                "source": src["source"],
                "title": art.title,
                "description": clean_desc,
                "published": published,
                "author": art.authors[0] if art.authors else None,
                "language": lang,
                "content": clean_content,
                "content_en": content_en,
                "image": art.top_image or None,
                "topic": topic,
                "thread_id": thread_id,
                "fetched_at": datetime.utcnow(),
            }

            res = await articles_col.insert_one(doc)
            article_oid = res.inserted_id

            await threads_col.update_one(
                {"_id": thread_id},
                {
                    "$addToSet": {"articles": article_oid},
                    "$setOnInsert": {"created_at": datetime.utcnow()},
                    "$set": {"last_updated": datetime.utcnow()},
                },
                upsert=True
            )

            total += 1
            time.sleep(DELAY)

    return total


if __name__ == "__main__":
    import asyncio

    count = asyncio.run(crawl_and_process())
    print(f"Crawled and processed {count} new articles")
