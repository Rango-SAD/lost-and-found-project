from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware 
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie

from src.api.routes.auth_routes import router as auth_router
from src.infrastructure.database.models.user_document import UserDocument
from src.infrastructure.database.models.otp_document import OTPDocument 
from src.infrastructure.security.auth_handler import AuthHandler

@asynccontextmanager
async def lifespan(app: FastAPI):
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    await init_beanie(
        database=client.lost_and_found_v2, 
        document_models=[UserDocument, OTPDocument]
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
    
    yield

app = FastAPI(title="Lost and Found University System", lifespan=lifespan) 

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Lost and Found API"}