from pydantic import BaseModel, Field
from datetime import datetime, timezone
from typing import Optional


class Category(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    key: str
    title_fa: str
    color_code: str
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )

    class Config:
        populate_by_name = True
