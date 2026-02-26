from fastapi import APIRouter, HTTPException, Depends
from src.infrastructure.database.models.post_document import PostDocument
from src.infrastructure.database.models.comment_document import CommentDocument
from src.infrastructure.database.models.report_document import ReportDocument
from src.infrastructure.security.auth_handler import AuthHandler
from pydantic import BaseModel
from typing import Optional
from beanie import PydanticObjectId

router = APIRouter(prefix="/interact", tags=["Interactions"])

class CommentRequest(BaseModel):
    post_id: str
    content: str
    parent_id: Optional[str] = None

@router.get("/comments/{post_id}")
async def get_comments(post_id: str):
    comments = await CommentDocument.find(
        CommentDocument.post_id == post_id
    ).sort("+created_at").to_list()

    return [
        {
            "id": str(c.id),
            "post_id": c.post_id,
            "publisher_username": c.publisher_username,
            "content": c.content,
            "parent_id": c.parent_id,
            "reports_count": c.reports_count,
            "created_at": c.created_at.isoformat(),
        } for c in comments
    ]

@router.post("/comment")
async def add_comment(req: CommentRequest, current_user: str = Depends(AuthHandler.get_current_user)):
    try:
        obj_id = PydanticObjectId(req.post_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid ID")

    post = await PostDocument.get(obj_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    comment = CommentDocument(
        post_id=req.post_id,
        publisher_username=current_user, 
        content=req.content,
        parent_id=req.parent_id,
    )
    await comment.insert()
    return {"id": str(comment.id), "status": "success"}

@router.post("/report/{target_type}/{target_id}")
async def report_content(target_type: str, target_id: str, current_user: str = Depends(AuthHandler.get_current_user)):
    try:
        obj_id = PydanticObjectId(target_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid ID")

    if target_type == "post":
        doc = await PostDocument.get(obj_id)
    elif target_type == "comment":
        doc = await CommentDocument.get(obj_id)
    else:
        raise HTTPException(status_code=400, detail="Invalid type")

    if not doc:
        raise HTTPException(status_code=404, detail="Not found")

    report = ReportDocument(
        reporter_username=current_user, 
        target_id=obj_id,
        target_type=target_type,
        reason="Report",
    )
    await report.insert()

    doc.reports_count = getattr(doc, 'reports_count', 0) + 1
    
    if doc.reports_count >= 5:
        await doc.delete()
        return {"deleted": True, "reports_count": doc.reports_count}

    await doc.save()
    return {"deleted": False, "reports_count": doc.reports_count}