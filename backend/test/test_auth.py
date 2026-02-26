import sys
from pathlib import Path
from datetime import datetime, timedelta, timezone
import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from beanie import init_beanie
from mongomock_motor import AsyncMongoMockClient
from unittest.mock import patch
from fastapi import HTTPException
from jose import jwt

sys.path.append(str(Path(__file__).parent.parent))

from src.main import app
from src.infrastructure.database.models.user_document import UserDocument
from src.infrastructure.database.models.otp_document import OTPDocument
from src.infrastructure.security.auth_handler import AuthHandler
from src.infrastructure.security.email_handler import EmailHandler

@pytest_asyncio.fixture(autouse=True)
async def init_test_db():
    client = AsyncMongoMockClient()
    await init_beanie(
        database=client.test_db,
        document_models=[UserDocument, OTPDocument]
    )

@pytest.mark.asyncio
async def test_send_otp_email_already_exists():
    user = UserDocument(username="old_user", email="taken@sharif.edu", password="hash")
    await user.insert()
    
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/auth/send-otp", json={"email": "taken@sharif.edu"})
    assert response.status_code == 400
    assert "exists" in response.json()["detail"].lower()

@pytest.mark.asyncio
async def test_send_otp_update_existing_entry():
    # Updated to your new email
    target_email = "mahsa.h4642@gmail.com"
    old_otp = OTPDocument(email=target_email, otp_code="111111", 
                          expire_at=datetime.now(timezone.utc) + timedelta(minutes=1))
    await old_otp.insert()
    
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/auth/send-otp", json={"email": target_email})
    
    assert response.status_code == 200
    updated_otp = await OTPDocument.find_one(OTPDocument.email == target_email)
    assert updated_otp.otp_code != "111111"

@pytest.mark.asyncio
async def test_register_password_mismatch():
    payload = {
        "email": "mahsa.h4642@gmail.com",
        "username": "tester",
        "password": "Pass1",
        "confirm_password": "Pass2",
        "otp_code": "123456"
    }
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/auth/register/confirm", json=payload)
    assert response.status_code == 400
    assert "match" in response.json()["detail"].lower()

@pytest.mark.asyncio
async def test_register_invalid_otp():
    payload = {
        "email": "mahsa.h4642@gmail.com",
        "username": "user1",
        "password": "Password123",
        "confirm_password": "Password123",
        "otp_code": "000000"
    }
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/auth/register/confirm", json=payload)
    assert response.status_code == 400

@pytest.mark.asyncio
async def test_register_expired_otp():
    email = "mahsa.h4642@gmail.com"
    otp_val = "999999"
    expired_otp = OTPDocument(email=email, otp_code=otp_val, 
                               expire_at=datetime.now(timezone.utc) - timedelta(minutes=1))
    await expired_otp.insert()
    
    payload = {
        "email": email,
        "username": "expired_man",
        "password": "Password123",
        "confirm_password": "Password123",
        "otp_code": otp_val
    }
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/auth/register/confirm", json=payload)
    assert response.status_code == 400
    assert "expired" in response.json()["detail"].lower()

@pytest.mark.asyncio
async def test_register_username_taken():
    user = UserDocument(username="boss", email="boss@sharif.edu", password="hash")
    await user.insert()
    
    email = "mahsa.h4642@gmail.com"
    otp_val = "123456"
    otp_doc = OTPDocument(email=email, otp_code=otp_val, 
                          expire_at=datetime.now(timezone.utc) + timedelta(minutes=5))
    await otp_doc.insert()
    
    payload = {
        "email": email,
        "username": "boss",
        "password": "Password123",
        "confirm_password": "Password123",
        "otp_code": otp_val
    }
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/auth/register/confirm", json=payload)
    assert response.status_code == 400
    assert "taken" in response.json()["detail"].lower()

@pytest.mark.asyncio
async def test_email_handler_failure():
    with patch("smtplib.SMTP_SSL") as mock_smtp:
        mock_smtp.side_effect = Exception("SMTP Connection Error")
        result = await EmailHandler.send_verification_email("mahsa.h4642@gmail.com", "123456")
        assert result is False

@pytest.mark.asyncio
async def test_full_success_flow():
    email = "mahsa.h4642@gmail.com"
    username = "success_user"
    password = "ValidPassword123"
    
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        await ac.post("/auth/send-otp", json={"email": email})
        otp_doc = await OTPDocument.find_one(OTPDocument.email == email)
        
        reg_payload = {
            "email": email,
            "username": username,
            "password": password,
            "confirm_password": password,
            "otp_code": otp_doc.otp_code
        }
        reg_resp = await ac.post("/auth/register/confirm", json=reg_payload)
        assert reg_resp.status_code == 200
        
        login_resp = await ac.post("/auth/login", json={
            "username": username,
            "password": password
        })
        
        if login_resp.status_code != 200:
            print(f"Login failed with: {login_resp.json()}")
            
        assert login_resp.status_code == 200
        assert "access_token" in login_resp.json()

@pytest.mark.asyncio
async def test_login_user_not_found_full_coverage():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/auth/login", json={
            "username": "totally_random_user_123",
            "password": "some_password"
        })
    assert response.status_code == 401

@pytest.mark.asyncio
async def test_login_route_exception_handling():
    with patch("src.application.use_cases.login.LoginUseCase.execute") as mock_exec:
        mock_exec.side_effect = Exception("Unexpected System Error")
        
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
            response = await ac.post("/auth/login", json={
                "username": "any", "password": "any"
            })
        
        assert response.status_code == 401
        assert "Unexpected System Error" in response.json()["detail"]

@pytest.mark.asyncio
async def test_send_otp_exception_handling():
    with patch("src.application.use_cases.register.RegisterUseCase.send_otp") as mock_otp:
        mock_otp.side_effect = Exception("Database Connection Lost")
        
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
            try:
                response = await ac.post("/auth/send-otp", json={"email": "mahsa.h4642@gmail.com"})
            except:
                pass

@pytest.mark.asyncio
async def test_auth_handler_verify_token_success():
    """Test successful token verification"""
    from fastapi.security import HTTPAuthorizationCredentials
    
    username = "test_user"
    token = AuthHandler.create_access_token({"sub": username})
    auth_creds = HTTPAuthorizationCredentials(scheme="Bearer", credentials=token)
    
    result = await AuthHandler.get_current_user(auth_creds)
    assert result == username

@pytest.mark.asyncio
async def test_auth_handler_invalid_token():
    """Test invalid token exception"""
    from fastapi.security import HTTPAuthorizationCredentials
    from fastapi import HTTPException
    
    auth_creds = HTTPAuthorizationCredentials(scheme="Bearer", credentials="not-a-real-token")
    
    with pytest.raises(HTTPException) as excinfo:
        await AuthHandler.get_current_user(auth_creds)
    assert excinfo.value.status_code == 401

@pytest.mark.asyncio
async def test_auth_handler_token_missing_sub():
    """Test token without 'sub' field"""
    from fastapi.security import HTTPAuthorizationCredentials
    from fastapi import HTTPException
    from jose import jwt
    from src.infrastructure.security.auth_handler import SECRET_KEY, ALGORITHM
    
    token = jwt.encode(
        {"exp": datetime.now(timezone.utc) + timedelta(minutes=10)}, 
        SECRET_KEY, 
        algorithm=ALGORITHM
    )
    auth_creds = HTTPAuthorizationCredentials(scheme="Bearer", credentials=token)
    
    with pytest.raises(HTTPException) as excinfo:
        await AuthHandler.get_current_user(auth_creds)
    assert excinfo.value.status_code == 401