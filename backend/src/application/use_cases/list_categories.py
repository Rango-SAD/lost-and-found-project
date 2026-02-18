from domain.interfaces.category_repository import CategoryRepository


class ListCategoriesUseCase:
    def __init__(self, repository: CategoryRepository):
        self.repository = repository

    async def execute(self):
        return await self.repository.list_all()
