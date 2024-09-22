# tests/test_access_activity.py

from datetime import datetime
from fastapi import status

def test_create_access_activity(client):
    # Create a user and a lector first
    user_response = client.post(
        "/users/",
        json={"name": "Bob", "email": "bob@example.com"}
    )
    user_id = user_response.json()["id"]

    lector_response = client.post(
        "/lectors/",
        json={
            "role_user_required": 1,
            "name": "Entrance Gate",
            "location": "Main Hall",
            "status": "active"
        }
    )
    lector_id = lector_response.json()["id"]

    response = client.post(
        "/access_activity/",
        json={
            "user_id": user_id,
            "lector_id": lector_id,
            "datetime": datetime.utcnow().isoformat(),
            "exit_datetime": None,
            "access_type": "entry",
            "event": "success"
        }
    )
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["user_id"] == user_id
    assert data["lector_id"] == lector_id
    assert "id" in data

def test_read_access_activities(client):
    response = client.get("/access_activity/")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0

def test_read_access_activity(client):
    # Assuming the first access activity has ID 1
    response = client.get("/access_activity/1")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["id"] == 1

def test_update_access_activity(client):
    response = client.put(
        "/access_activity/1",
        json={
            "user_id": 1,
            "lector_id": 1,
            "datetime": datetime.utcnow().isoformat(),
            "exit_datetime": datetime.utcnow().isoformat(),
            "access_type": "exit",
            "event": "success"
        }
    )
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["access_type"] == "exit"
    assert data["exit_datetime"] is not None

def test_delete_access_activity(client):
    response = client.delete("/access_activity/1")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["message"] == "Access activity deleted successfully"

    # Verify deletion
    response = client.get("/access_activity/1")
    assert response.status_code == status.HTTP_404_NOT_FOUND
