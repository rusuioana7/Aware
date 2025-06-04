from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

from database import articles_col

app = FastAPI(title="Aware News Service")


class ArticleIn(BaseModel):
    title: str
    content: str


class ArticleOut(BaseModel):
    id: str = Field(alias="_id")
    title: str
    content: str

    model_config = {"populate_by_name": True}


@app.get("/ping")
async def ping():
    return {"ping": "pong"}


@app.post("/articles", response_model=ArticleOut)
async def create_article(article: ArticleIn):
    new_doc = article.dict()
    result = await articles_col.insert_one(new_doc)
    if not result.inserted_id:
        raise HTTPException(status_code=500, detail="Insert failed")
    created = await articles_col.find_one({"_id": result.inserted_id})
    if not created:
        raise HTTPException(status_code=500, detail="Inserted document not found")

    created["_id"] = str(created["_id"])
    return created


@app.get("/articles", response_model=list[ArticleOut])
async def list_articles(limit: int = 20, skip: int = 0):
    cursor = articles_col.find().skip(skip).limit(limit)
    docs = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        docs.append(doc)
    return docs
