from fastapi import APIRouter

from api.schemas.post_schema import PostResponse, CreatePostRequest, UpdatePostRequest
from application.use_cases.posts.create_post import CreatePostUseCase
from application.use_cases.posts.list_posts import ListPostsUseCase
from application.use_cases.posts.get_posts_by_publisher import GetPostsByPublisherUseCase
from application.use_cases.posts.get_posts_by_category import GetPostsByCategoryUseCase
from application.use_cases.posts.update_post import UpdatePostUseCase
from application.use_cases.posts.delete_post import DeletePostUseCase


router = APIRouter(prefix="/posts", tags=["Posts"])

@router.get("/all", response_model=list[PostResponse])
def get_all_posts():
    use_case = ListPostsUseCase()
    return use_case.execute()

@router.get("/publisher/{username}", response_model=list[PostResponse])
def get_posts_by_publisher(username: str):
    use_case = GetPostsByPublisherUseCase()
    return use_case.execute(username)

@router.get("/category/{category_key}", response_model=list[PostResponse])
def get_posts_by_category(category_key: str):
    use_case = GetPostsByCategoryUseCase()
    return use_case.execute(category_key)

@router.post("/add", response_model=PostResponse)
def create_post(request: CreatePostRequest):
    use_case = CreatePostUseCase()
    return use_case.execute(request)

@router.put("/{post_id}", response_model=PostResponse)
def update_post(post_id: str, request: UpdatePostRequest):
    use_case = UpdatePostUseCase()
    return use_case.execute(post_id, request)

@router.delete("/{post_id}")
def delete_post(post_id: str):
    use_case = DeletePostUseCase()
    use_case.execute(post_id)
    return {"message": "Post deleted successfully"}



