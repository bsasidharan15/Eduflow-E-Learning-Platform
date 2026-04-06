# backend/tests/test_students.py
def test_list_students_empty_initially(client, admin_headers):
    resp = client.get("/students", headers=admin_headers)
    assert resp.status_code == 200
    assert resp.json() == []


def test_create_student(client, admin_headers):
    resp = client.post("/students",
                       json={"email": "student@test.com", "full_name": "Test Student",
                             "password": "Pass@1234"},
                       headers=admin_headers)
    assert resp.status_code == 201
    data = resp.json()
    assert data["email"] == "student@test.com"
    assert data["role"] == "student"


def test_create_duplicate_student(client, admin_headers):
    payload = {"email": "dup@test.com", "full_name": "Dup", "password": "Pass@1234"}
    client.post("/students", json=payload, headers=admin_headers)
    resp = client.post("/students", json=payload, headers=admin_headers)
    assert resp.status_code == 409


def test_delete_student(client, admin_headers):
    create_resp = client.post("/students",
                              json={"email": "del@test.com", "full_name": "Del",
                                    "password": "Pass@1234"},
                              headers=admin_headers)
    student_id = create_resp.json()["id"]
    del_resp = client.delete(f"/students/{student_id}", headers=admin_headers)
    assert del_resp.status_code == 204


def test_students_requires_admin(client):
    resp = client.get("/students")
    assert resp.status_code == 401
