from typing import Optional, List, Literal
from pydantic import BaseModel, Field
from datetime import datetime, timezone



class GeoLocation(BaseModel):
    type: Literal["Point"] = "Point"
    coordinates: List[float] = Field(
        ..., description="[longitude, latitude]"
    )


class LostFoundItem(BaseModel):
    id: Optional[str] = None

    type: Literal["lost", "found"]
    title: str
    category: str
    tag: str
    description: str
    publisher_username: str

    location: GeoLocation

    reports_count: int = 0
    image_url: Optional[str] = None

    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )
