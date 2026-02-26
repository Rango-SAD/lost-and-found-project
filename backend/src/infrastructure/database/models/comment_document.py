from beanie import Document, PydanticObjectId
from datetime import datetime
from typing import Optional
from pydantic import Field

class CommentDocument(Document):
    post_id: str  
    publisher_username: str  
    content: str
    parent_id: Optional[str] = None
    reports_count: int = Field(default=0)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "comments"