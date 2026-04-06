# backend/tests/test_lessons.py
def _get_first_module_id(client):
    course_id = client.get("/courses").json()[0]["id"]
    return client.get(f"/courses/{course_id}/modules").json()[0]["id"]


def test_list_lessons(client):
    module_id = _get_first_module_id(client)
    resp = client.get(f"/modules/{module_id}/lessons")
    assert resp.status_code == 200
    data = resp.json()
    assert len(data) == 1
    assert data[0]["title"] == "Variables, Data Types & Control Flow"


def test_create_lesson(client, admin_headers):
    module_id = _get_first_module_id(client)
    resp = client.post(f"/modules/{module_id}/lessons",
                       json={"title": "Lesson 2", "youtube_url": "https://www.youtube.com/embed/abc"},
                       headers=admin_headers)
    assert resp.status_code == 201
    assert resp.json()["title"] == "Lesson 2"


def test_update_lesson(client, admin_headers):
    module_id = _get_first_module_id(client)
    lesson_id = client.get(f"/modules/{module_id}/lessons").json()[0]["id"]
    resp = client.patch(f"/lessons/{lesson_id}", json={"title": "Updated Title"},
                        headers=admin_headers)
    assert resp.status_code == 200
    assert resp.json()["title"] == "Updated Title"


def test_delete_lesson(client, admin_headers):
    module_id = _get_first_module_id(client)
    lesson_id = client.get(f"/modules/{module_id}/lessons").json()[0]["id"]
    resp = client.delete(f"/lessons/{lesson_id}", headers=admin_headers)
    assert resp.status_code == 204
    assert client.get(f"/modules/{module_id}/lessons").json() == []


def test_get_lesson_by_id(client):
    module_id = _get_first_module_id(client)
    lesson_id = client.get(f"/modules/{module_id}/lessons").json()[0]["id"]
    resp = client.get(f"/lessons/{lesson_id}")
    assert resp.status_code == 200
    assert resp.json()["resources"] == []
