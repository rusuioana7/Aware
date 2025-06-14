from pydantic import BaseModel, Field, HttpUrl
from typing import List, Optional
from datetime import datetime
from bson import ObjectId


class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v, _info):
        if isinstance(v, ObjectId):
            return v
        if not ObjectId.is_valid(v):
            raise ValueError(f"Invalid ObjectId: {v}")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(cls, core_schema, _handler):
        string_schema = core_schema.json_type_schema("string")
        string_schema["pattern"] = "^[0-9a-fA-F]{24}$"
        return string_schema


class Thread(BaseModel):
    id: str = Field(alias="_id")
    title: str
    language: Optional[str]
    last_updated: str
    image: Optional[str] = None
    topic: Optional[str] = None
    articles: List[str]

    model_config = {
        "populate_by_name": True,
        "json_encoders": {
            ObjectId: lambda v: str(v),
            datetime: lambda v: v.isoformat(),
        },
    }


class Article(BaseModel):
    id: PyObjectId = Field(..., alias="_id")
    url: str
    source: str
    title: str
    description: Optional[str]
    published: Optional[str]
    author: Optional[str]
    content: str
    image: Optional[str]
    topics: List[str]
    fetched_at: datetime
    thread: Optional[Thread]

    model_config = {
        "validate_by_name": True,
        "json_schema_mode": "validation",
        "json_encoders": {ObjectId: lambda v: str(v)}
    }


class CrawlResponse(BaseModel):
    success: bool
    crawled: int


class FeedResponse(BaseModel):
    articles: Optional[List[Article]] = None
    threads: Optional[List[Thread]] = None

    model_config = {
        "populate_by_name": True,
    }
