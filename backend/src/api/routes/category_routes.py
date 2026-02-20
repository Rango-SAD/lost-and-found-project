from fastapi import APIRouter

from src.api.schemas.category_schema import CategoryResponse, CreateCategoryRequest
from src.application.use_cases.create_category import CreateCategoryUseCase
from src.application.use_cases.list_categories import ListCategoriesUseCase


router = APIRouter(prefix="/categories",tags=["Categories"],)


@router.post("/add", response_model=CategoryResponse)
def create_category(request: CreateCategoryRequest):
    use_case = CreateCategoryUseCase()
    return use_case.execute(request)


@router.get("/all", response_model=list[CategoryResponse])
def get_categories():
    use_case = ListCategoriesUseCase()
    return use_case.execute()
