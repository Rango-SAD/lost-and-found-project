from typing import List

from src.domain.entities.category import Category
from src.domain.interfaces.repositories.ICategoryRepository import (
    ICategoryRepository,
)
from src.infrastructure.database.models.category_document import (
    CategoryDocument,
)


class MongoCategoryRepository(ICategoryRepository):

    async def list_all(self) -> List[Category]:
        docs = await CategoryDocument.find_all().to_list()

        return [
            Category(
                id=str(doc.id),
                key=doc.key,
                title_fa=doc.title_fa,
                color_code=doc.color_code,
            )
            for doc in docs
        ]

    async def create(self, category: Category) -> Category:
        doc = CategoryDocument(
            key=category.key,
            title_fa=category.title_fa,
            color_code=category.color_code,
        )
        await doc.insert()

        return Category(
            id=str(doc.id),
            key=doc.key,
            title_fa=doc.title_fa,
            color_code=doc.color_code,
        )
