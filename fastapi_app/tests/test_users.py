# tests/test_users.py

from fastapi import status

def test_create_user(client):
    response = client.post(
        "/users/",
        json={"name": "Alice", "email": "alice@example.com"}
    )
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["name"] == "Alice"
    assert data["email"] == "alice@example.com"
    assert "id" in data

def test_read_users(client):
    response = client.get("/users/")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert isinstance(data, list)
    assert any(user["email"] == "alice@example.com" for user in data)

def test_read_user(client):
    # Assuming the first user has ID 1
    response = client.get("/users/1")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["id"] == 1

def test_update_user(client):
    response = client.put(
        "/users/1",
        json={"name": "Alice Smith", "email": "alice.smith@example.com"}
    )
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["name"] == "Alice Smith"
    assert data["email"] == "alice.smith@example.com"

def test_delete_user(client):
    response = client.delete("/users/1")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["message"] == "User deleted successfully"

    # Verify deletion
    response = client.get("/users/1")
    assert response.status_code == status.HTTP_404_NOT_FOUND
