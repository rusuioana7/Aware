import os
import re
import json
import time
import feedparser
import language_tool_python
from urllib.parse import urlparse
from datetime import datetime
from dateutil import parser as date_parser
from newspaper import Article as NewsArticle
from langdetect import detect, DetectorFactory
from typing import Tuple

from dotenv import load_dotenv
from openai import AsyncOpenAI
from app.thread_assigner import assigner
from app.database import articles_col, threads_col
from app.config import RSS_SOURCES, MAX_ARTICLES_PER_SOURCE, DELAY, TOPICS, credibility_map, CLICKBAIT_PATTERNS, \
    AD_PATTERNS

load_dotenv()
client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))
DetectorFactory.seed = 0
tool = language_tool_python.LanguageTool('en-US')


def get_domain(url: str) -> str:
    try:
        return urlparse(url).netloc.replace("www.", "")
    except:
        return ""


def is_clickbait(title: str) -> bool:
    return any(re.search(pat, title.lower()) for pat in CLICKBAIT_PATTERNS)


def is_ad_content(title: str, content: str) -> bool:
    combined = f"{title} {content}".lower()
    return any(re.search(pat, combined) for pat in AD_PATTERNS)


def assess_grammar(text: str) -> bool:
    if not text.strip():
        return False
    matches = tool.check(text)
    error_rate = len(matches) / max(len(text.split()), 1)
    return error_rate < 0.05


def label_from_score(score: int) -> str:
    if score >= 80:
        return "high"
    elif score >= 50:
        return "medium"
    return "low"


def compute_score_fields(article: dict) -> dict:
    score = 0
    domain = get_domain(article.get("url", ""))
    trust = credibility_map.get(domain, "unrated")

    if trust == "high":
        score += 40
    elif trust == "medium":
        score += 20

    if assess_grammar(article.get("content", "")):
        score += 15

    title = article.get("title", "")
    content = article.get("content", "")
    ad = is_ad_content(title, content)
    clickbait = is_clickbait(title)

    if not clickbait:
        score += 10
    if not ad:
        score += 5
    else:
        score -= 10

    if article.get("author"):
        score += 5
    if article.get("image"):
        score += 5
    if article.get("description"):
        score += 5
    if len(content) > 500:
        score += 10

    final_score = max(0, min(score, 100))
    return {
        "credibility_score": final_score,
        "credibility_label": label_from_score(final_score),
        "is_clickbait": clickbait,
        "is_ad": ad
    }


async def process_article_via_llm(raw_content: str, raw_description: str) -> Tuple[str, str, str]:
    system = {
        "role": "system",
        "content": (
            "You are an assistant that takes raw news article text and a raw summary, "
            "then outputs a JSON object with exactly three keys: "
            "`content`, `description`, and `topic`."
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
                                                                                         "Respond only with a valid JSON object."
        )
    }

    resp = await client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[system, user],
        temperature=0.0,
        max_tokens=2000
    )
    try:
        data = json.loads(resp.choices[0].message.content.strip())
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
                art.download()
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
            content_en = await translate_to_english(clean_content) if lang != "en" else clean_content
            thread_id = await assigner.assign(content_en, topic)

            base_doc = {
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

            score_fields = compute_score_fields(base_doc)
            doc = {**base_doc, **score_fields}

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

            thread_doc = await threads_col.find_one({"_id": thread_id}, {"articles": 1})
            if thread_doc:
                lang_cursor = articles_col.find({"_id": {"$in": thread_doc["articles"]}}, {"language": 1})
                langs = list({a["language"] async for a in lang_cursor if "language" in a})
                await threads_col.update_one({"_id": thread_id}, {"$set": {"languages": langs}})

            total += 1
            time.sleep(DELAY)

    return total


if __name__ == "__main__":
    import asyncio

    count = asyncio.run(crawl_and_process())
    print(f"Crawled and processed {count} new articles.")
