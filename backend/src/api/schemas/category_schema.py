from pydantic import BaseModel

class CategoryResponse(BaseModel):
    key: str
    title_fa: str
    color_code: str


class CreateCategoryRequest(BaseModel):
    key: str
    title_fa: str
    color_code: str
