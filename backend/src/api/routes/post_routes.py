from fastapi import APIRouter, Depends
from src.api.schemas.post_schema import PostResponse, CreatePostRequest, UpdatePostRequest
from src.application.use_cases.create_post import CreatePostUseCase
from src.application.use_cases.list_posts import ListPostsUseCase
from src.application.use_cases.get_posts_by_publisher import GetPostsByPublisherUseCase
from src.application.use_cases.get_posts_by_category import GetPostsByCategoryUseCase
from src.application.use_cases.update_post import UpdatePostUseCase
from src.application.use_cases.delete_post import DeletePostUseCase
from src.infrastructure.repositories.mongo_post_repository import MongoPostRepository
from src.infrastructure.security.auth_handler import AuthHandler

router = APIRouter(prefix="/posts", tags=["Posts"])

@router.get("/all", response_model=list[PostResponse])
async def get_all_posts():
    post_repo = MongoPostRepository()
    use_case = ListPostsUseCase(post_repo)
    return await use_case.execute()

@router.get("/publisher/{username}", response_model=list[PostResponse])
async def get_posts_by_publisher(username: str):
    post_repo = MongoPostRepository()
    use_case = GetPostsByPublisherUseCase(post_repo)
    return await use_case.execute(username)

@router.get("/category/{category_key}", response_model=list[PostResponse])
async def get_posts_by_category(category_key: str):
    post_repo = MongoPostRepository()
    use_case = GetPostsByCategoryUseCase(post_repo)
    return await use_case.execute(category_key)

@router.post("/add", response_model=PostResponse)
async def create_post(request: CreatePostRequest, current_user: str = Depends(AuthHandler.get_current_user)):
    request.publisher_username = current_user 
    post_repo = MongoPostRepository()
    use_case = CreatePostUseCase(post_repo)
    return await use_case.execute(request)

@router.put("/{post_id}", response_model=PostResponse)
async def update_post(post_id: str, request: UpdatePostRequest, current_user: str = Depends(AuthHandler.get_current_user)):
    post_repo = MongoPostRepository()
    use_case = UpdatePostUseCase(post_repo)
    return await use_case.execute(post_id, request)

@router.delete("/{post_id}")
async def delete_post(post_id: str, current_user: str = Depends(AuthHandler.get_current_user)):
    post_repo = MongoPostRepository()
    use_case = DeletePostUseCase(post_repo)
    await use_case.execute(post_id)
    return {"message": "Post deleted successfully"}