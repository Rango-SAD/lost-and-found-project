from fastapi import APIRouter
from typing import List

from domain.entities.lost_found_item import LostFoundItem
from infrastructure.persistence.lost_found_repository import MongoLostFoundRepository
from application.use_cases.create_lost_found_item import CreateLostFoundItem
from application.use_cases.list_lost_found_items import ListLostFoundItemsUseCase

router = APIRouter(prefix="/api/posts", tags=["Posts"])


@router.post("", response_model=LostFoundItem)
async def create_post(item: LostFoundItem):
    repo = MongoLostFoundRepository()
    use_case = CreateLostFoundItem(repo)
    return await use_case.execute(item)


@router.get("", response_model=List[LostFoundItem])
async def get_posts():
    repo = MongoLostFoundRepository()
    use_case = ListLostFoundItemsUseCase(repo)
    return await use_case.execute()
