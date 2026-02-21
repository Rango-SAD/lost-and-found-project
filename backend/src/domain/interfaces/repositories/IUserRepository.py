from abc import ABC, abstractmethod
from src.domain.entities.user import User
from typing import Optional

class IUserRepository(ABC):
    @abstractmethod
    async def get_by_username(self, username: str) -> Optional[User]:
        pass