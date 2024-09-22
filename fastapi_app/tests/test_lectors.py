# tests/test_lectors.py

from fastapi import status

def test_create_lector(client):
    response = client.post(
        "/lectors/",
        json={
            "role_user_required": 1,
            "name": "Main Gate",
            "location": "Entrance",
            "status": "active"
        }
    )
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["name"] == "Main Gate"
    assert "id" in data

def test_read_lectors(client):
    response = client.get("/lectors/")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert isinstance(data, list)
    assert any(lector["name"] == "Main Gate" for lector in data)

def test_read_lector(client):
    # Assuming the first lector has ID 1
    response = client.get("/lectors/1")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["id"] == 1

def test_update_lector(client):
    response = client.put(
        "/lectors/1",
        json={
            "role_user_required": 2,
            "name": "Side Gate",
            "location": "Exit",
            "status": "inactive"
        }
    )
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["name"] == "Side Gate"
    assert data["status"] == "inactive"

def test_delete_lector(client):
    response = client.delete("/lectors/1")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["message"] == "Lector deleted successfully"

    # Verify deletion
    response = client.get("/lectors/1")
    assert response.status_code == status.HTTP_404_NOT_FOUND
