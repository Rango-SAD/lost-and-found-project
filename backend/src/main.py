from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware 
from src.api.routes.category_routes import router as category_router
from src.api.routes.post_routes import router as post_router
from motor.motor_asyncio import AsyncIOMotorClient
from src.infrastructure.database.models.category_document import CategoryDocument
from src.infrastructure.database.models.post_document import PostDocument
from beanie import init_beanie

app = FastAPI(title="Lost and Found University System") 

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(category_router)
app.include_router(post_router)

@app.on_event("startup")
async def auth_db():
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    await init_beanie(database=client.lost_and_found_v2, document_models=[CategoryDocument,
        PostDocument])


@app.get("/")
def read_root():
    return {"message": "Welcome to Lost and Found API"}