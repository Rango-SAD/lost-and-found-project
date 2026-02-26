import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from beanie import init_beanie
from mongomock_motor import AsyncMongoMockClient
from datetime import datetime, timezone
from unittest.mock import patch

from src.main import app
from src.infrastructure.database.models.post_document import PostDocument
from src.infrastructure.database.models.user_document import UserDocument
from src.infrastructure.security.auth_handler import AuthHandler
from src.domain.entities.post import Post

@pytest_asyncio.fixture(autouse=True)
async def init_test_db():
    client = AsyncMongoMockClient()
    await init_beanie(
        database=client.test_db,
        document_models=[PostDocument, UserDocument]
    )

@pytest_asyncio.fixture
def mock_user_token():
    return AuthHandler.create_access_token({"sub": "test_publisher"})

@pytest.mark.asyncio
async def test_create_post_success(mock_user_token):
    payload = {
        "type": "lost",
        "title": "سوییچ ماشین",
        "category_key": "electronics",
        "tag": "سوییچ",
        "description": "توضیحات تست",
        "publisher_username": "any",
        "location": {"type": "Point", "coordinates": [51.38, 35.68]},
        "image_url": "http://example.com/i.jpg"
    }
    headers = {"Authorization": f"Bearer {mock_user_token}"}
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/posts/add", json=payload, headers=headers)
    assert response.status_code == 200
    assert response.json()["publisher_username"] == "test_publisher"

@pytest.mark.asyncio
async def test_get_all_posts():
    post = PostDocument(
        type="found", title="کارت", category_key="cards", 
        description=".", publisher_username="u1", 
        created_at=datetime.now(timezone.utc), tag="t1",
        location={"type": "Point", "coordinates": [51.0, 35.0]}
    )
    await post.insert()
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/posts/all")
    assert response.status_code == 200
    assert len(response.json()) >= 1

@pytest.mark.asyncio
async def test_get_posts_by_category():
    post = PostDocument(
        type="lost", title="لپتاپ", category_key="digital", 
        description=".", publisher_username="u2",
        created_at=datetime.now(timezone.utc), tag="t2",
        location={"type": "Point", "coordinates": [51.0, 35.0]}
    )
    await post.insert()
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/posts/category/digital")
    assert response.status_code == 200
    assert response.json()[0]["category_key"] == "digital"

@pytest.mark.asyncio
async def test_get_posts_by_publisher():
    username = "user_test"
    post = PostDocument(
        type="found", title="عینک", category_key="optics", 
        description=".", publisher_username=username,
        created_at=datetime.now(timezone.utc), tag="t3",
        location={"type": "Point", "coordinates": [51.0, 35.0]}
    )
    await post.insert()
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get(f"/posts/publisher/{username}")
    assert response.status_code == 200
    assert response.json()[0]["publisher_username"] == username

@pytest.mark.asyncio
async def test_delete_post_success(mock_user_token):
    post = PostDocument(
        type="lost", title="حذف", category_key="t", 
        description=".", publisher_username="test_publisher",
        created_at=datetime.now(timezone.utc), tag="t",
        location={"type": "Point", "coordinates": [51.0, 35.0]}
    )
    await post.insert()
    headers = {"Authorization": f"Bearer {mock_user_token}"}
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.delete(f"/posts/{str(post.id)}", headers=headers)
    assert response.status_code == 200
    check = await PostDocument.get(str(post.id))
    assert check is None

@pytest.mark.asyncio
async def test_update_post_success(mock_user_token):
    post = PostDocument(
        type="lost", title="قدیمی", category_key="t", 
        description=".", publisher_username="test_publisher",
        created_at=datetime.now(timezone.utc), tag="t",
        location={"type": "Point", "coordinates": [51.0, 35.0]}
    )
    await post.insert()
    headers = {"Authorization": f"Bearer {mock_user_token}"}
    payload = {"title": "جدید", "description": "توضیحات جدید"}
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.put(f"/posts/{str(post.id)}", json=payload, headers=headers)
    assert response.status_code == 200
    assert response.json()["title"] == "جدید"

@pytest.mark.asyncio
async def test_get_posts_by_tag():
    post = PostDocument(
        type="found", title="ساعت", category_key="j", 
        description=".", publisher_username="u3",
        created_at=datetime.now(timezone.utc), tag="gold",
        location={"type": "Point", "coordinates": [51.0, 35.0]}
    )
    await post.insert()
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/posts/tag/gold")
    assert response.status_code == 200
    assert response.json()[0]["tag"] == "gold"

@pytest.mark.asyncio
async def test_search_posts_mocked():
    mock_post = Post(
        id="65f123456789", type="lost", title="گوشی سامسونگ",
        category_key="d", tag="p", description=".",
        publisher_username="u1", created_at=datetime.now(timezone.utc),
        location={"type": "Point", "coordinates": [51.0, 35.0]}
    )
    with patch("src.infrastructure.repositories.mongo_post_repository.MongoPostRepository.search_in_title_and_description") as m:
        m.return_value = [mock_post]
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
            response = await ac.get("/posts/search", params={"query": "سامسونگ"})
        assert response.status_code == 200
        assert response.json()[0]["title"] == "گوشی سامسونگ"