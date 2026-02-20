from src.application.dto.category_dto import CategoryDTO, CreateCategoryDTO
from src.domain.interfaces.repositories.ICategoryRepository import ICategoryRepository


class CreateCategoryUseCase:
    def __init__(self, category_repo: ICategoryRepository):
        self.category_repo = category_repo

    async def execute(self, data: CreateCategoryDTO) -> CategoryDTO:
        category = await self.category_repo.create(
            key=data.key,
            title_fa=data.title_fa,
            color_code=data.color_code,
        )

        return CategoryDTO(
            key=category.key,
            title_fa=category.title_fa,
            color_code=category.color_code,
        )
