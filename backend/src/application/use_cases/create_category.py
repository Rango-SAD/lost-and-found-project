from domain.entities.category import Category
from domain.interfaces.category_repository import CategoryRepository


class CreateCategory:
    def __init__(self, repository: CategoryRepository):
        self.repository = repository

    async def execute(self, category: Category) -> Category:
        return await self.repository.create(category)
