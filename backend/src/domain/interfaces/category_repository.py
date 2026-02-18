from abc import ABC, abstractmethod
from typing import List
from domain.entities.category import Category


class CategoryRepository(ABC):

    @abstractmethod
    async def create(self, category: Category) -> Category:
        pass

    @abstractmethod
    async def list_all(self) -> List[Category]:
        pass
