from typing import List

from src.application.dto.map_item_dto import MapItemDTO, MapLocationDTO
from src.domain.interfaces.repositories.IPostRepository import IPostRepository


class GetMapItemsUseCase:
    def __init__(self, post_repo: IPostRepository):
        self.post_repo = post_repo

    async def execute(self) -> List[MapItemDTO]:
        posts = await self.post_repo.list_all()

        result: List[MapItemDTO] = []
        for post in posts:
            # Extract location
            location = None
            if post.location:
                try:
                    # location is stored as dict: {"type": "Point", "coordinates": [lng, lat]}
                    if isinstance(post.location, dict):
                        coords = post.location.get("coordinates")
                        if coords and len(coords) >= 2:
                            # GeoJSON: [longitude, latitude]
                            location = MapLocationDTO(lat=coords[1], lng=coords[0])
                    else:
                        coords = post.location.coordinates
                        if coords and len(coords) >= 2:
                            location = MapLocationDTO(lat=coords[1], lng=coords[0])
                except Exception:
                    location = None

            # Map type to Persian status
            status = "گم‌شده" if post.type == "lost" else "پیدا‌شده"

            result.append(
                MapItemDTO(
                    id=post.id,
                    itemName=post.title,
                    status=status,
                    type=post.type,
                    title=post.title,
                    category_key=post.category_key,
                    tag=post.tag,
                    description=post.description,
                    publisher_username=post.publisher_username,
                    image_url=post.image_url,
                    reports_count=post.reports_count,
                    created_at=post.created_at,
                    location=location,
                )
            )

        return result