from dataclasses import dataclass
from typing import List, Literal


@dataclass
class GeoLocation:
    type: Literal["Point"] = "Point"
    coordinates: List[float] = None
