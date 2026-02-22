from fastapi import APIRouter, HTTPException, Body
from src.infrastructure.database.models.post_document import PostDocument
from src.infrastructure.database.models.comment_document import CommentDocument
from src.infrastructure.database.models.report_document import ReportDocument
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/interact", tags=["Interactions"])

class CommentRequest(BaseModel):
    post_id: str
    publisher_username: str  
    content: str
    parent_id: Optional[str] = None

@router.post("/comment")
async def add_comment(req: CommentRequest):
    post = await PostDocument.get(req.post_id)
    if not post:
        raise HTTPException(status_code=404, detail="پستی با این کد پیدا نشد")

    comment = CommentDocument(
        post_id=req.post_id,
        publisher_username=req.publisher_username,
        content=req.content,
        parent_id=req.parent_id
    )
    await comment.insert()
    return {"message": "کامنت با موفقیت ثبت شد", "id": str(comment.id)}

@router.post("/report/{target_type}/{target_id}")
async def report_content(target_type: str, target_id: str, reporter_username: str = Body(..., embed=True)):
    if target_type == "post":
        doc = await PostDocument.get(target_id)
    elif target_type == "comment":
        doc = await CommentDocument.get(target_id)
    else:
        raise HTTPException(status_code=400, detail="نوع هدف باید post یا comment باشد")

    if not doc:
        raise HTTPException(status_code=404, detail="محتوا یافت نشد")

    report = ReportDocument(
        reporter_username=reporter_username,
        target_id=target_id,
        target_type=target_type,
        reason="گزارش کاربر"
    )
    await report.insert()

    doc.reports_count += 1
    
    if doc.reports_count > 5:
        await doc.delete()
        return {"message": "محتوا به دلیل گزارش‌های زیاد حذف شد"}
    
    await doc.save()
    return {"message": "گزارش ثبت شد", "reports_count": doc.reports_count}