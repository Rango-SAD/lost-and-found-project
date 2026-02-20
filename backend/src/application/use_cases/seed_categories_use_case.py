from domain.entities.category import Category
from backend.src.domain.interfaces.repositories.category_repository import CategoryRepository


DEFAULT_CATEGORIES = [
    ("Electronics", "الکترونیکی", "#00f5ff"),
    ("Documents", "مدارک", "#4d7cff"),
    ("Wallets / Cards", "کیف/کارت", "#39ff88"),
    ("Clothing", "پوشاک", "#ff4fd8"),
    ("Accessories", "اکسسوری", "#9b5cff"),
    ("Keys", "کلید", "#ffe347"),
    ("Books", "کتاب", "#ff9f43"),
    ("Other", "سایر", "#ff5c5c"),
]


class SeedCategoriesUseCase:
    def __init__(self, repository: CategoryRepository):
        self.repository = repository

    async def execute(self):
        for key, title_fa, color in DEFAULT_CATEGORIES:
            exists = await self.repository.exists_by_key(key)
            if exists:
                continue

            category = Category(
                key=key,
                title_fa=title_fa,
                color_code=color,
            )
            await self.repository.create(category)
