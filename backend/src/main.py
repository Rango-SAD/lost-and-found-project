from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware 
from api.routes import lost_found, categories

app = FastAPI(title="Lost and Found University System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True, 
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(lost_found.router)
app.include_router(categories.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Lost and Found API"}