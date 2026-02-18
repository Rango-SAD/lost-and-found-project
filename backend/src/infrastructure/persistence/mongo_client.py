from pymongo import MongoClient
import os

MONGO_URL = os.getenv("MONGO_URL", "mongodb://mongodb:27017")

client = MongoClient(MONGO_URL)

mongo_db = client["lost_and_found_db"]
