from dataclasses import dataclass
from typing import List, Optional, Literal
from datetime import datetime

from src.domain.entities.post import Post


@dataclass
class GeoLocationDTO:
    type: Literal["Point"]
    coordinates: List[float]

@dataclass
class PostDTO:
    id: str

    type: Literal["lost", "found"]
    title: str
    category_key: str
    tag: str
    description: str
    publisher_username: str

    location: GeoLocationDTO

    reports_count: int
    image_url: Optional[str]
    created_at: datetime

    @classmethod
    def from_entity(cls, post: Post) -> "PostDTO":
        return cls(
            id=post.id,
            type=post.type,
            title=post.title,
            category_key=post.category_key,
            tag=post.tag,
            description=post.description,
            publisher_username=post.publisher_username,
            location={
            "type": post.location["type"],
            "coordinates": post.location["coordinates"],
            },
            reports_count=post.reports_count,
            image_url=post.image_url,
            created_at=post.created_at,
        )

@dataclass
class CreatePostDTO:
    type: Literal["lost", "found"]
    title: str
    category_key: str
    tag: str
    description: str
    publisher_username: str

    location: GeoLocationDTO
    image_url: Optional[str] = None

@dataclass
class UpdatePostDTO:
    title: Optional[str] = None
    category_key: Optional[str] = None
    tag: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
