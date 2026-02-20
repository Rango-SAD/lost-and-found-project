from typing import Optional, List, Literal
from pydantic import BaseModel, Field
from datetime import datetime, timezone


class GeoLocationSchema(BaseModel):
    type: Literal["Point"] = "Point"
    coordinates: List[float] = Field(
        ..., description="[longitude, latitude]"
    )


class PostResponse(BaseModel):
    id: str

    type: Literal["lost", "found"]
    title: str
    category_key: str
    tag: str
    description: str
    publisher_username: str

    location: GeoLocationSchema

    reports_count: int
    image_url: Optional[str]
    created_at: datetime


class CreatePostRequest(BaseModel):
    type: Literal["lost", "found"]
    title: str
    category_key: str
    tag: str
    description: str
    publisher_username: str

    location: GeoLocationSchema
    image_url: Optional[str] = None


class UpdatePostRequest(BaseModel):
    title: Optional[str] = None
    category_key: Optional[str] = None
    tag: Optional[str] = None
    description: Optional[str] = None
    location: Optional[GeoLocationSchema] = None
    image_url: Optional[str] = None
