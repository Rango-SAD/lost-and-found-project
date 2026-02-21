from src.domain.interfaces.repositories.IUserRepository import IUserRepository
from src.infrastructure.database.models.user_document import UserDocument

class MongoUserRepository(IUserRepository):
    async def get_by_username(self, username: str):
        return await UserDocument.find_one(UserDocument.username == username)