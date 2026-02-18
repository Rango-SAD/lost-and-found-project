from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware 
from api.routes.lost_found import router as lost_found_router

app = FastAPI(title="Lost and Found University System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True, 
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(lost_found_router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Lost and Found API"}