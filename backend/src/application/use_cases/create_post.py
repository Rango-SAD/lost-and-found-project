from src.application.dto.post_dto import PostDTO, CreatePostDTO
from src.domain.interfaces.repositories.IPostRepository import IPostRepository


class CreatePostUseCase:
    def __init__(self, post_repo: IPostRepository):
        self.post_repo = post_repo

    async def execute(self, data: CreatePostDTO) -> PostDTO:
        post = await self.post_repo.create(data)

        return PostDTO.from_entity(post)
