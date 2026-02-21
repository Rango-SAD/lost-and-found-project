from src.domain.entities.category import Category
from src.domain.interfaces.repositories.ICategoryRepository import ICategoryRepository


class CreateCategoryUseCase:
    def __init__(self, category_repo: ICategoryRepository):
        self.category_repo = category_repo

    async def execute(self, request):
        category = Category(
            id=None,
            key=request.key,
            title_fa=request.title_fa,
            color_code=request.color_code,
        )

        return await self.category_repo.create(category)