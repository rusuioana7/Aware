import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/aware_news")

mongo_client = AsyncIOMotorClient(MONGO_URI)

db = mongo_client["aware_news"]

raw_rss_col = db["raw_rss"]
articles_col = db["articles"]
