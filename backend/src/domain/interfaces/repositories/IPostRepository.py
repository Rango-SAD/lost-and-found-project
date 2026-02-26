from abc import ABC, abstractmethod
from typing import List, Optional

from src.domain.entities.post import Post


class IPostRepository(ABC):

    @abstractmethod
    async def list_all(self) -> List[Post]:
        pass

    @abstractmethod
    async def get_by_id(self, post_id: str) -> Optional[Post]:
        pass

    @abstractmethod
    async def get_by_publisher(self, username: str) -> List[Post]:
        pass

    @abstractmethod
    async def get_by_category(self, category_key: str) -> List[Post]:
        pass

    @abstractmethod
    async def create(self, post: Post) -> Post:
        pass

    @abstractmethod
    async def update(self, post_id: str, post: Post) -> Post:
        pass

    @abstractmethod
    async def delete(self, post_id: str) -> None:
        pass

    @abstractmethod
    async def search_in_title_and_description(self, query: str):
        pass

    @abstractmethod
    async def get_by_tag(self, tag: str):
        pass
