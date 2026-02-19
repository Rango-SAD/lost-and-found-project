from typing import Optional
from src.domain.entities.user import User
from src.domain.interfaces.repositories.IUserRepository import IUserRepository
from src.infrastructure.database.models.user_document import UserDocument

class UserRepository(IUserRepository):
    async def get_by_username(self, username: str) -> Optional[User]:
        user_doc = await UserDocument.find_one(UserDocument.username == username)
        if not user_doc:
            return None
        
        return User(
            id=str(user_doc.id),
            username=user_doc.username,
            password=user_doc.password
        )