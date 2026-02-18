from fastapi import APIRouter
from typing import List

from domain.entities.category import Category
from infrastructure.persistence.category_repository import MongoCategoryRepository
from application.use_cases.create_category import CreateCategory
from application.use_cases.list_categories import ListCategoriesUseCase

router = APIRouter(prefix="/api/categories", tags=["Categories"])


@router.post("", response_model=Category)
async def create_category(category: Category):
    repo = MongoCategoryRepository()
    use_case = CreateCategory(repo)
    return await use_case.execute(category)


@router.get("", response_model=List[Category])
async def get_categories():
    repo = MongoCategoryRepository()
    use_case = ListCategoriesUseCase(repo)
    return await use_case.execute()
