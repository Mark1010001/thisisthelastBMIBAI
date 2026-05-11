from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def get_auth_headers():
    response = client.post(
        "/api/auth/login",
        data={"username": "admin", "password": "admin123"},
    )
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

def test_get_data():
    headers = get_auth_headers()
    response = client.get("/api/data", headers=headers)
    assert response.status_code == 200
    assert "patterns" in response.json()
    assert "chart_data" in response.json()

def test_calculate_normal():
    headers = get_auth_headers()
    response = client.post("/api/calculate", headers=headers, json={
        "gender": "Male",
        "age": 30,
        "weight": 70,
        "height": 175,
        "hip_cm": 90,
        "active_standard": "Global WHO Standard"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["bmi"] == 22.9
    assert data["bmi_category"] == "Normal"

def test_calculate_asian_standard():
    headers = get_auth_headers()
    # BMI 24.0 is Normal in WHO but Overweight in Asian
    response = client.post("/api/calculate", headers=headers, json={
        "gender": "Male",
        "age": 30,
        "weight": 73.5,
        "height": 175,
        "hip_cm": 90,
        "active_standard": "Asian Clinical Standard"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["bmi"] == 24.0
    assert data["bmi_category"] == "Overweight"

def test_bai_calculation():
    headers = get_auth_headers()
    # Formula: (Hip / Height^1.5) - 18
    # (100 / 1.7^1.5) - 18 = (100 / 2.215) - 18 = 45.14 - 18 = 27.14
    response = client.post("/api/calculate", headers=headers, json={
        "gender": "Female",
        "age": 25,
        "weight": 60,
        "height": 170,
        "hip_cm": 100,
        "active_standard": "Global WHO Standard"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["bai"] == 27.1
    assert data["bai_category"] == "Normal"
