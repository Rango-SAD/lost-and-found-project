from typing import Optional
from src.domain.entities.user import User
from src.domain.interfaces.repositories.IUserRepository import IUserRepository

class UserRepository(IUserRepository):
    def __init__(self):
        self._users = [
            User(id=1, username="test", password="pass1234")
        ]

    def get_by_username(self, username: str) -> Optional[User]:
        for user in self._users:
            if user.username == username:
                return user
        return None