from src.application.dto.post_dto import PostDTO
from src.domain.interfaces.repositories.IPostRepository import IPostRepository


class SearchPostsUseCase:
    def __init__(self, post_repo: IPostRepository):
        self.post_repo = post_repo

    async def execute(self, query: str) -> list[PostDTO]:
        posts = await self.post_repo.search_in_title_and_description(query)
        return [PostDTO.from_entity(post) for post in posts]
