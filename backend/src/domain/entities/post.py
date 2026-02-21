from dataclasses import dataclass
from typing import Optional, Literal
from datetime import datetime

from src.domain.entities.geo_location import GeoLocation


@dataclass
class Post:
    id: Optional[str] = None

    type: Literal["lost", "found"] = "lost"
    title: str = ""
    category_key: str = ""
    tag: str = ""
    description: str = ""
    publisher_username: str = ""

    location: Optional[GeoLocation] = None

    reports_count: int = 0
    image_url: Optional[str] = None
    created_at: Optional[datetime] = None
