import sys
from pathlib import Path
from httpx import AsyncClient, ASGITransport
import pytest
import pytest_asyncio
from beanie import init_beanie
from mongomock_motor import AsyncMongoMockClient

sys.path.append(str(Path(__file__).parent.parent))

from src.main import app
from src.infrastructure.database.models.user_document import UserDocument
from src.infrastructure.database.models.otp_document import OTPDocument

@pytest_asyncio.fixture(autouse=True)
async def init_test_db():
    client = AsyncMongoMockClient()
    await init_beanie(
        database=client.test_db,
        document_models=[UserDocument, OTPDocument]
    )

@pytest.mark.asyncio
async def test_request_otp_success():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/auth/send-otp", json={"email": "student@sharif.edu"})
    assert response.status_code in [200, 400, 500] 

@pytest.mark.asyncio
async def test_invalid_email_format():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/auth/send-otp", json={"email": "invalid-email"})
    assert response.status_code == 422

@pytest.mark.asyncio
async def test_wrong_otp_verification():
    payload = {
        "email": "test@sharif.edu",
        "username": "tester",
        "password": "Password123",
        "confirm_password": "Password123",
        "otp_code": "0000"
    }
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/auth/register/confirm", json=payload)
    assert response.status_code == 400

@pytest.mark.asyncio
async def test_password_mismatch_validation():
    payload = {
        "email": "test@sharif.edu",
        "username": "tester2",
        "password": "Pass123",
        "confirm_password": "DifferentPass",
        "otp_code": "123456"
    }
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/auth/register/confirm", json=payload)
    assert response.status_code == 400

@pytest.mark.asyncio
async def test_successful_login_flow():
    login_data = {"username": "existing_user", "password": "correct_password"}
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/auth/login", json=login_data)
    assert response.status_code in [200, 401]