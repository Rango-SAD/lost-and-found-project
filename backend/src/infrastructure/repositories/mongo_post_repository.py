from typing import List, Optional
from datetime import datetime

from src.domain.entities.post import Post
from src.domain.entities.geo_location import GeoLocation
from src.domain.interfaces.repositories.IPostRepository import IPostRepository
from src.infrastructure.database.models.post_document import PostDocument


class MongoPostRepository(IPostRepository):

    async def list_all(self) -> List[Post]:
        docs = await PostDocument.find_all().to_list()
        return [self._to_entity(doc) for doc in docs]

    async def get_by_id(self, post_id: str) -> Optional[Post]:
        doc = await PostDocument.get(post_id)
        return self._to_entity(doc) if doc else None

    async def get_by_publisher(self, username: str) -> List[Post]:
        docs = await PostDocument.find(
            PostDocument.publisher_username == username
        ).to_list()
        return [self._to_entity(doc) for doc in docs]

    async def get_by_category(self, category_key: str) -> List[Post]:
        docs = await PostDocument.find(
            PostDocument.category_key == category_key
        ).to_list()
        return [self._to_entity(doc) for doc in docs]

    async def create(self, post: Post) -> Post:
        doc = PostDocument(
            type=post.type,
            title=post.title,
            category_key=post.category_key,
            tag=post.tag,
            description=post.description,
            publisher_username=post.publisher_username,
            location={
                "type" : post.location["type"],
                "coordinates" : post.location["coordinates"],
            },
            image_url=post.image_url,
            reports_count=post.reports_count,
            created_at=datetime.now(),
        )
        await doc.insert()
        return self._to_entity(doc)

    async def update(self, post_id: str, post: Post) -> Post:
        doc = await PostDocument.get(post_id)
        if not doc:
            raise ValueError("Post not found")

        for field, value in post.__dict__.items():
            if value is not None:
                setattr(doc, field, value)

        await doc.save()
        return self._to_entity(doc)

    async def delete(self, post_id: str) -> None:
        doc = await PostDocument.get(post_id)
        if doc:
            await doc.delete()

    async def search_in_title_and_description(self, query: str):
        return await PostDocument.find(
            {"$text": {"$search": query}}
        ).to_list()

    async def get_by_tag(self, tag: str):
        docs = await PostDocument.find(
            PostDocument.tag == tag
        ).to_list()
        return [self._to_entity(doc) for doc in docs]
    
    # ---------- private ----------

    def _to_entity(self, doc: PostDocument) -> Post:
        return Post(
            id=str(doc.id),
            type=doc.type,
            title=doc.title,
            category_key=doc.category_key,
            tag=doc.tag,
            description=doc.description,
            publisher_username=doc.publisher_username,
            location={
                "type": doc.location.type,
                "coordinates": doc.location.coordinates 
            },
            reports_count=doc.reports_count,
            image_url=doc.image_url,
            created_at=doc.created_at,
        )
