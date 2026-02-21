from src.application.dto.category_dto import CategoryDTO
from src.domain.interfaces.repositories.ICategoryRepository import ICategoryRepository


class ListCategoriesUseCase:
    def __init__(self, category_repo: ICategoryRepository):
        self.category_repo = category_repo

    async def execute(self) -> list[CategoryDTO]:
        categories = await self.category_repo.list_all()

        return [
            CategoryDTO(
                key=category.key,
                title_fa=category.title_fa,
                color_code=category.color_code,
            )
            for category in categories
        ]
