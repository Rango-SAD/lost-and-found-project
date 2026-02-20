from motor.motor_asyncio import AsyncIOMotorClient
import os

MONGO_URI = os.getenv("MONGO_URI", "mongodb://mongo:27017")
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", "app_db")

mongo_client: AsyncIOMotorClient | None = None
mongo_db = None


async def connect_to_mongo():
    global mongo_client, mongo_db

    mongo_client = AsyncIOMotorClient(MONGO_URI)
    mongo_db = mongo_client[MONGO_DB_NAME]


async def close_mongo_connection():
    global mongo_client

    if mongo_client:
        mongo_client.close()
