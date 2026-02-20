from beanie import Document
from typing import Optional
from datetime import datetime

from src.infrastructure.database.models.geo_location import GeoLocation


class PostDocument(Document):
    type: str
    title: str
    category_key: str
    tag: Optional[str] = None
    description: str

    publisher_username: str

    location: Optional[GeoLocation] = None

    image_url: Optional[str] = None
    reports_count: int = 0
    created_at: datetime

    class Settings:
        name = "posts"
