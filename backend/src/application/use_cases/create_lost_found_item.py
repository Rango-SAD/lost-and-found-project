from domain.entities.lost_found_item import LostFoundItem
from domain.interfaces.lost_found_repository import LostFoundRepository


class CreateLostFoundItem:
    def __init__(self, repository: LostFoundRepository):
        self.repository = repository

    async def execute(self, item: LostFoundItem) -> LostFoundItem:
        return await self.repository.create(item)
