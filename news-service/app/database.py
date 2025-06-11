from motor.motor_asyncio import AsyncIOMotorClient
from app.config import MONGO_URI

mongo_client = AsyncIOMotorClient(MONGO_URI)
db = mongo_client["aware_news"]
raw_rss_col = db["raw_rss"]
articles_col = db["articles"]
