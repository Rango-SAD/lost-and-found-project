import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware 
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie

from src.api.routes.auth_routes import router as auth_router
from src.api.routes.category_routes import router as category_router
from src.api.routes.post_routes import router as post_router

from src.infrastructure.database.models.user_document import UserDocument
from src.infrastructure.database.models.category_document import CategoryDocument
from src.infrastructure.database.models.post_document import PostDocument
from src.infrastructure.database.models.otp_document import OTPDocument 
from src.infrastructure.security.auth_handler import AuthHandler

app = FastAPI(title="Lost and Found University System") 

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(category_router)
app.include_router(post_router)

@app.on_event("startup")
async def auth_db():
    mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017")
    mongo_db = os.getenv("MONGO_DB", "lost_and_found_v2")

    client = AsyncIOMotorClient(mongo_uri)

    await init_beanie(
        database=client[mongo_db],
        document_models=[
            CategoryDocument,
            PostDocument,
        ],
    )

    
    existing_user = await UserDocument.find_one(UserDocument.username == "admin")
    if not existing_user:
        hashed_pass = AuthHandler.hash_password("password123") 
        admin_user = UserDocument(
            username="admin",
            password=hashed_pass,
            email="admin@test.com"
        )
        await admin_user.insert()
        print("Test user 'admin' created successfully.")

@app.get("/")
def read_root():
    return {"message": "Welcome to Lost and Found API"}