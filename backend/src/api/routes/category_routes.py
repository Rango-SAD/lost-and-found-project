from fastapi import APIRouter , Depends

from src.api.schemas.category_schema import CategoryResponse, CreateCategoryRequest
from src.application.use_cases.create_category import CreateCategoryUseCase
from src.application.use_cases.list_categories import ListCategoriesUseCase
from src.infrastructure.repositories.mongo_category_repository import MongoCategoryRepository
from src.infrastructure.security.auth_handler import AuthHandler

router = APIRouter(prefix="/categories",tags=["Categories"],)


@router.post("/add", response_model=CategoryResponse)
async def create_category(request: CreateCategoryRequest, current_user: str = Depends(AuthHandler.get_current_user)):
    category_repo = MongoCategoryRepository()
    use_case = CreateCategoryUseCase(category_repo)
    return await use_case.execute(request)

@router.get("/all", response_model=list[CategoryResponse])
async def get_categories():
    category_repo = MongoCategoryRepository()
    use_case = ListCategoriesUseCase(category_repo)
    return await use_case.execute()