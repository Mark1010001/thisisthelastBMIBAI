import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

@pytest.fixture
def token():
    response = client.post(
        "/api/auth/login",
        data={"username": "admin", "password": "admin123"},
    )
    return response.json()["access_token"]

def test_login_success():
    response = client.post(
        "/api/auth/login",
        data={"username": "admin", "password": "admin123"},
    )
    assert response.status_code == 200
    assert "access_token" in response.json()

def test_login_failure():
    response = client.post(
        "/api/auth/login",
        data={"username": "admin", "password": "wrongpassword"},
    )
    assert response.status_code == 401

def test_get_me_success(token):
    response = client.get(
        "/api/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    assert response.json()["username"] == "admin"

def test_get_me_failure():
    response = client.get(
        "/api/auth/me",
        headers={"Authorization": "Bearer invalidtoken"},
    )
    assert response.status_code == 401

def test_signup_success():
    response = client.post(
        "/api/auth/signup",
        json={"username": "newuser", "password": "password123", "full_name": "New User"},
    )
    assert response.status_code == 200
    assert response.json()["username"] == "newuser"

def test_signup_duplicate_username():
    # 'admin' already exists
    response = client.post(
        "/api/auth/signup",
        json={"username": "admin", "password": "password123", "full_name": "Admin Clone"},
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Username already registered"

def test_guest_login_success():
    response = client.post("/api/auth/guest")
    assert response.status_code == 200
    assert "access_token" in response.json()
    

def test_get_me_guest():
    token = client.post("/api/auth/guest").json()["access_token"]
    response = client.get(
        "/api/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    assert response.json()["username"] == "guest"
    assert response.json()["full_name"] == "Guest User"
