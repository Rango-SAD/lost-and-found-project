from fastapi import APIRouter
from typing import List

from src.api.schemas.map_schema import MapItemResponse, MapLocationSchema
from src.application.use_cases.get_map_items import GetMapItemsUseCase
from src.infrastructure.repositories.mongo_post_repository import MongoPostRepository

router = APIRouter(prefix="/lostAndFoundItems", tags=["Map"])


@router.get("", response_model=List[MapItemResponse])
async def get_map_items():
    """
    Returns all posts formatted for the map view.
    Frontend (useMapItems.ts) fetches from this endpoint.
    """
    post_repo = MongoPostRepository()
    use_case = GetMapItemsUseCase(post_repo)
    items = await use_case.execute()

    result = []
    for item in items:
        location = None
        if item.location:
            location = MapLocationSchema(lat=item.location.lat, lng=item.location.lng)

        result.append(
            MapItemResponse(
                id=item.id,
                itemName=item.itemName,
                status=item.status,
                type=item.type,
                title=item.title,
                category_key=item.category_key,
                tag=item.tag,
                description=item.description,
                publisher_username=item.publisher_username,
                image_url=item.image_url,
                reports_count=item.reports_count,
                created_at=item.created_at,
                location=location,
            )
        )

    return result