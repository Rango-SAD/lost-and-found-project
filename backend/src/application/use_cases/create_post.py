from src.application.dto.post_dto import PostDTO, CreatePostDTO
from src.domain.entities.post import Post
from src.domain.interfaces.repositories.IPostRepository import IPostRepository


class CreatePostUseCase:
    def __init__(self, post_repo: IPostRepository):
        self.post_repo = post_repo

    async def execute(self, data: CreatePostDTO) -> PostDTO:
        post_entity = Post(
            id=None,
            type=data.type,
            title=data.title,
            category_key=data.category_key,
            tag=data.tag,
            description=data.description,
            publisher_username=data.publisher_username,
            location={
                "type": data.location.type,
                "coordinates": data.location.coordinates,
            },
            reports_count=0,
            image_url=data.image_url,
            created_at=None,
        )

        post = await self.post_repo.create(post_entity)

        return PostDTO.from_entity(post)
