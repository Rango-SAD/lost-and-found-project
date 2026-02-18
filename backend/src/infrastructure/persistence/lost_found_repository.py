from domain.entities.lost_found_item import LostFoundItem
from domain.interfaces.lost_found_repository import LostFoundRepository
from infrastructure.persistence.mongo_client import mongo_db


class MongoLostFoundRepository(LostFoundRepository):

    async def create(self, item: LostFoundItem) -> LostFoundItem:
        data = item.dict(exclude={"id"})
        result = await mongo_db.lost_found_items.insert_one(data)
        item.id = str(result.inserted_id)
        return item

    async def list_all(self):
        items = []
        cursor = mongo_db.lost_found_items.find()
        async for doc in cursor:
            doc["id"] = str(doc["_id"])
            doc.pop("_id")
            items.append(LostFoundItem(**doc))
        return items
