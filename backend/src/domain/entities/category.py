from dataclasses import dataclass
from typing import Optional


@dataclass
class Category:
    id: Optional[str] = None
    key: str = ""
    title_fa: str = ""
    color_code: str = ""
