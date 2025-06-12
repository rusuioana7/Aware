from fastapi import FastAPI
from app.routers import router

app = FastAPI(title="News Crawler Service")
app.include_router(router)
