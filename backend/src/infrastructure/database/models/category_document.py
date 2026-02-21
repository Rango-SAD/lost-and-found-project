from beanie import Document


class CategoryDocument(Document):
    key: str
    title_fa: str
    color_code: str

    class Settings:
        name = "categories"
