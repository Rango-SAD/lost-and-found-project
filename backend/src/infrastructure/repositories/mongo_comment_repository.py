from ..database.models.comment_document import CommentDocument
from ..persistence import db 

class CommentRepository:
    async def add_comment(self, comment: CommentDocument):
        result = await db.comments.insert_one(comment.dict())
        return str(result.inserted_id)

    async def get_by_post(self, post_id: str):
        cursor = db.comments.find({"post_id": post_id})
        return await cursor.to_list(length=100)