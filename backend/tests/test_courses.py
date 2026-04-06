# backend/tests/test_courses.py
def test_list_courses(client):
    resp = client.get("/courses")
    assert resp.status_code == 200
    data = resp.json()
    assert isinstance(data, list)
    assert len(data) == 4  # seeded
    assert data[0]["name"] == "Python for AI"


def test_create_course(client, admin_headers):
    resp = client.post("/courses", json={"name": "NLP", "description": "Natural Language Processing"},
                       headers=admin_headers)
    assert resp.status_code == 201
    assert resp.json()["name"] == "NLP"


def test_create_course_requires_auth(client):
    resp = client.post("/courses", json={"name": "NLP"})
    assert resp.status_code == 401


def test_update_course(client, admin_headers):
    course_id = client.get("/courses").json()[0]["id"]
    resp = client.patch(f"/courses/{course_id}", json={"name": "Python for AI Updated"},
                        headers=admin_headers)
    assert resp.status_code == 200
    assert resp.json()["name"] == "Python for AI Updated"


def test_delete_course(client, admin_headers):
    course_id = client.get("/courses").json()[0]["id"]
    resp = client.delete(f"/courses/{course_id}", headers=admin_headers)
    assert resp.status_code == 204
    assert len(client.get("/courses").json()) == 3


def test_reorder_courses(client, admin_headers):
    courses = client.get("/courses").json()
    ids = [c["id"] for c in courses]
    reversed_ids = list(reversed(ids))
    resp = client.post("/courses/reorder", json={"ids": reversed_ids}, headers=admin_headers)
    assert resp.status_code == 200
    new_order = client.get("/courses").json()
    assert [c["id"] for c in new_order] == reversed_ids
