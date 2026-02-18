from domain.entities.category import Category
from domain.interfaces.category_repository import CategoryRepository
from infrastructure.persistence.mongo_client import mongo_db


class MongoCategoryRepository(CategoryRepository):

    async def create(self, category: Category) -> Category:
        data = category.dict(exclude={"id"})
        result = await mongo_db.categories.insert_one(data)
        category.id = str(result.inserted_id)
        return category

    async def list_all(self):
        categories = []
        cursor = mongo_db.categories.find()
        async for doc in cursor:
            doc["id"] = str(doc["_id"])
            doc.pop("_id")
            categories.append(Category(**doc))
        return categories
