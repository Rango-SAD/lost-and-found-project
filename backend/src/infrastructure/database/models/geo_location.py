from typing import List
from pydantic import BaseModel


class GeoLocation(BaseModel):
    type: str = "Point"
    coordinates: List[float]
