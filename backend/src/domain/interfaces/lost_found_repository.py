from abc import ABC, abstractmethod
from typing import List
from domain.entities.lost_found_item import LostFoundItem


class LostFoundRepository(ABC):

    @abstractmethod
    async def create(self, item: LostFoundItem) -> LostFoundItem:
        pass

    @abstractmethod
    async def list_all(self) -> List[LostFoundItem]:
        pass
