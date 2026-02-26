from dataclasses import dataclass
from typing import Optional
from datetime import datetime


@dataclass
class MapLocationDTO:
    lat: float
    lng: float


@dataclass
class MapItemDTO:
    id: str
    itemName: str
    status: str               # "گم‌شده" | "پیدا‌شده"
    type: str                 # "lost" | "found"
    title: str
    category_key: str
    tag: Optional[str]
    description: str
    publisher_username: str
    image_url: Optional[str]
    reports_count: int
    created_at: Optional[datetime]
    location: Optional[MapLocationDTO] = None