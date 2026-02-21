from src.domain.interfaces.repositories.IPostRepository import IPostRepository


class DeletePostUseCase:
    def __init__(self, post_repo: IPostRepository):
        self.post_repo = post_repo

    async def execute(self, post_id: str) -> None:
        await self.post_repo.delete(post_id)
