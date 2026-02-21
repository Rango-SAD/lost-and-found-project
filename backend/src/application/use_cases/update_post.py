from src.application.dto.post_dto import PostDTO, UpdatePostDTO
from src.domain.interfaces.repositories.IPostRepository import IPostRepository


class UpdatePostUseCase:
    def __init__(self, post_repo: IPostRepository):
        self.post_repo = post_repo

    async def execute(self, post_id: str, data: UpdatePostDTO) -> PostDTO:
        post = await self.post_repo.update(post_id, data)

        return PostDTO.from_entity(post)
