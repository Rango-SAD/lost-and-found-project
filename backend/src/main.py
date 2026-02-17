from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware 
from src.api.routes.auth_routes import router as auth_router

app = FastAPI(title="Lost and Found University System")

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