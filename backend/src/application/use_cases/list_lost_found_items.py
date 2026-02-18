from domain.interfaces.lost_found_repository import LostFoundRepository


class ListLostFoundItemsUseCase:
    def __init__(self, repository: LostFoundRepository):
        self.repository = repository

    async def execute(self):
        return await self.repository.list_all()
