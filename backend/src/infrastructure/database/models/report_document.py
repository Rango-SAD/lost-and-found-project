from beanie import Document, PydanticObjectId
from datetime import datetime
from pydantic import Field

class ReportDocument(Document):
    reporter_username: str  
    target_id: PydanticObjectId  
    target_type: str = Field(pattern="^(post|comment)$")  
    reason: str  
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "reports"