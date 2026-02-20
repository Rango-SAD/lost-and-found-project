from dataclasses import dataclass


@dataclass
class CategoryDTO:
    key: str
    title_fa: str
    color_code: str


@dataclass
class CreateCategoryDTO:
    key: str
    title_fa: str
    color_code: str
