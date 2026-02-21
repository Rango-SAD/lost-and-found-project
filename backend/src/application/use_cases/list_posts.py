from src.application.dto.post_dto import PostDTO
from src.domain.interfaces.repositories.IPostRepository import IPostRepository


class ListPostsUseCase:
    def __init__(self, post_repo: IPostRepository):
        self.post_repo = post_repo

    async def execute(self) -> list[PostDTO]:
        posts = await self.post_repo.list_all()

        return [PostDTO.from_entity(post) for post in posts]
