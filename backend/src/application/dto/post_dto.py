from dataclasses import dataclass
from typing import List, Optional, Literal
from datetime import datetime


@dataclass
class GeoLocationDTO:
    type: Literal["Point"]
    coordinates: List[float]

@dataclass
class PostDTO:
    id: str

    type: Literal["lost", "found"]
    title: str
    category: str
    tag: str
    description: str
    publisher_username: str

    location: GeoLocationDTO

    reports_count: int
    image_url: Optional[str]
    created_at: datetime

@dataclass
class CreatePostDTO:
    type: Literal["lost", "found"]
    title: str
    category: str
    tag: str
    description: str
    publisher_username: str

    location: GeoLocationDTO
    image_url: Optional[str] = None

@dataclass
class UpdatePostDTO:
    title: Optional[str] = None
    category: Optional[str] = None
    tag: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
