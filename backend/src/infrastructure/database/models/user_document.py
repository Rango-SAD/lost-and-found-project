from beanie import Document
from typing import Optional

class UserDocument(Document):
    email: str
    username: str
    password: str
    is_active: bool = True

    class Settings:
        name = "users" 