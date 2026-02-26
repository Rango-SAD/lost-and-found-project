from src.application.dto.post_dto import PostDTO
from src.domain.interfaces.repositories.IPostRepository import IPostRepository


class GetPostsByTagUseCase:
    def __init__(self, post_repo: IPostRepository):
        self.post_repo = post_repo

    async def execute(self, tag: str) -> list[PostDTO]:
        posts = await self.post_repo.get_by_tag(tag)
        return [PostDTO.from_entity(post) for post in posts]
