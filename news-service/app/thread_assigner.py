import os
import numpy as np
from datetime import datetime
from typing import Dict, List

from dotenv import load_dotenv
from sklearn.feature_extraction.text import TfidfVectorizer
from motor.motor_asyncio import AsyncIOMotorClient
from app.database import articles_col
from bson import ObjectId
from openai import AsyncOpenAI

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/aware_news")
OPENAI_KEY = os.getenv("OPENAI_API_KEY")

mongo = AsyncIOMotorClient(MONGO_URI)
threads_col = mongo["aware_news"]["threads"]

openai_client = AsyncOpenAI(api_key=OPENAI_KEY)


async def generate_thread_title(examples: List[str]) -> str:
    prompt = (
            "You are a headline-writing assistant. "
            "Given these related news snippets, produce a 3–6 word title"
            " capturing their common theme like a news headline.\n\n"
            + "\n".join(f"- {e}" for e in examples)
            + "\n\nReply with just the title."
    )
    resp = await openai_client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "Write a 3–6 word news title."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.0,
        max_tokens=20
    )
    return resp.choices[0].message.content.strip().strip('"')


class ThreadAssigner:
    def __init__(self, threshold: float = 0.4):
        self.threshold = threshold
        self._centroids: Dict[ObjectId, np.ndarray] = {}
        self._vectorizer = TfidfVectorizer(
            max_features=1000, stop_words="english", ngram_range=(1, 2)
        )
        self._initialized = False

    async def _initialize(self):
        docs = await threads_col.find({}, {"title": 1}).to_list(None)
        texts, tids = [], []
        for doc in docs:
            title = doc.get("title")
            if title:
                texts.append(title)
                tids.append(doc["_id"])
        if texts:
            self._vectorizer.fit(texts)
            X = self._vectorizer.transform(texts).toarray()
            for vec, tid in zip(X, tids):
                self._centroids[tid] = vec
        self._initialized = True

    async def assign(self, text: str, topic: str) -> ObjectId:
        if not self._initialized:
            await self._initialize()

        if not self._centroids:
            return await self._create_new_thread(text, topic)

        vec = self._vectorizer.transform([text]).toarray()[0]
        best_tid, best_sim = None, -1.0

        for tid, c in self._centroids.items():
            thread_doc = await threads_col.find_one({"_id": tid})
            if not thread_doc:
                continue
            thread_topic = thread_doc.get("topic")
            if thread_topic != topic:
                continue

            sim = np.dot(vec, c) / (np.linalg.norm(vec) * np.linalg.norm(c) + 1e-9)
            if sim > best_sim:
                best_tid, best_sim = tid, sim

        if best_sim >= self.threshold and best_tid is not None:
            self._centroids[best_tid] = (self._centroids[best_tid] + vec) / 2
            await threads_col.update_one(
                {"_id": best_tid},
                {"$set": {"last_updated": datetime.utcnow()}}
            )

            thread_doc = await threads_col.find_one({"_id": best_tid})
            article_ids = thread_doc.get("articles", [])
            article_texts = []
            for aid in article_ids:
                a = await articles_col.find_one({"_id": aid})
                if a:
                    article_texts.append(a.get("description") or a.get("title") or "")

            article_texts.append(text[:200])
            new_title = await generate_thread_title(article_texts)
            await threads_col.update_one(
                {"_id": best_tid},
                {"$set": {"title": new_title}}
            )

            return best_tid

        return await self._create_new_thread(text, topic)

    async def _create_new_thread(self, text: str, topic: str) -> ObjectId:
        new_tid = ObjectId()

        if not self._initialized:
            await self._initialize()

        vec = self._vectorizer.transform([text]).toarray()[0]
        self._centroids[new_tid] = vec

        title = await generate_thread_title([text[:200]])
        await threads_col.insert_one({
            "_id": new_tid,
            "title": title,
            "language": "en",
            "topic": topic,
            "created_at": datetime.utcnow(),
            "last_updated": datetime.utcnow(),
            "articles": []
        })
        return new_tid


assigner = ThreadAssigner()
