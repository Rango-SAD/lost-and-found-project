from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class MapLocationSchema(BaseModel):
    lat: float
    lng: float


class MapItemResponse(BaseModel):
    id: str
    itemName: str
    status: str
    type: str
    title: str
    category_key: str
    tag: Optional[str] = None
    description: str
    publisher_username: str
    image_url: Optional[str] = None
    reports_count: int
    created_at: Optional[datetime] = None
    location: Optional[MapLocationSchema] = None