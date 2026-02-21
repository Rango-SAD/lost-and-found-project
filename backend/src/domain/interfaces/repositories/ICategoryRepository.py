from abc import ABC, abstractmethod
from typing import List

from src.domain.entities.category import Category


class ICategoryRepository(ABC):

    @abstractmethod
    async def list_all(self) -> List[Category]:
        pass

    @abstractmethod
    async def create(self, category: Category) -> Category:
        pass
