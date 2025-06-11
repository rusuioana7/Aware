from fastapi import FastAPI
from app.routers import router
from app.database import articles_col


def create_indexes():
    articles_col.create_index("url", unique=True)
    articles_col.create_index([("topics", 1)])
    articles_col.create_index([("published", -1)])


app = FastAPI(title="News Crawler Service")
app.include_router(router)


@app.on_event("startup")
def startup_event():
    create_indexes()
