import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware 
from fastapi.responses import RedirectResponse 
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie

# Routes
from src.api.routes.auth_routes import router as auth_router
from src.api.routes.category_routes import router as category_router
from src.api.routes.post_routes import router as post_router
from src.api.routes.interaction_routes import router as interaction_router 
from src.api.routes.map_routes import router as map_router  

# Models
from src.infrastructure.database.models.user_document import UserDocument
from src.infrastructure.database.models.category_document import CategoryDocument
from src.infrastructure.database.models.post_document import PostDocument
from src.infrastructure.database.models.otp_document import OTPDocument 
from src.infrastructure.database.models.comment_document import CommentDocument 
from src.infrastructure.database.models.report_document import ReportDocument 

from src.infrastructure.security.auth_handler import AuthHandler

@asynccontextmanager
async def lifespan(app: FastAPI):
    mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017")
    mongo_db = os.getenv("MONGO_DB", "lost_and_found_v2")
    client = AsyncIOMotorClient(mongo_uri)

    await init_beanie(
        database=client[mongo_db],
        document_models=[
            UserDocument,
            OTPDocument,
            CategoryDocument,
            PostDocument,
            CommentDocument, 
            ReportDocument   
        ],
    )

    existing_user = await UserDocument.find_one({"username": "admin"})
    if not existing_user:
        hashed_pass = AuthHandler.hash_password("password123") 
        admin_user = UserDocument(
            username="admin",
            password=hashed_pass,
            email="admin@test.com"
        )
        await admin_user.insert()
        print("✅ Test user 'admin' created successfully.")
    
    yield

    # Text index for title + description
    await PostDocument.get_motor_collection().create_index(
        [
            ("title", "text"),
            ("description", "text"),
        ]
    )

    # Index for tags
    await PostDocument.get_motor_collection().create_index("tags")
    client.close()

app = FastAPI(title="Lost and Found University System", lifespan=lifespan) 

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
app.include_router(interaction_router) 
app.include_router(map_router) 

@app.get("/", include_in_schema=False)
async def read_root():
    return RedirectResponse(url="/posts/all")