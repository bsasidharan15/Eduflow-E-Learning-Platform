# backend/tests/test_modules.py
def _get_first_course_id(client):
    return client.get("/courses").json()[0]["id"]


def test_list_modules(client):
    course_id = _get_first_course_id(client)
    resp = client.get(f"/courses/{course_id}/modules")
    assert resp.status_code == 200
    data = resp.json()
    assert len(data) == 2  # Python for AI has 2 modules
    assert data[0]["name"] == "Python Basics"


def test_create_module(client, admin_headers):
    course_id = _get_first_course_id(client)
    resp = client.post(f"/courses/{course_id}/modules",
                       json={"name": "Expert Python"}, headers=admin_headers)
    assert resp.status_code == 201
    assert resp.json()["name"] == "Expert Python"
    assert resp.json()["course_id"] == course_id


def test_update_module(client, admin_headers):
    course_id = _get_first_course_id(client)
    module_id = client.get(f"/courses/{course_id}/modules").json()[0]["id"]
    resp = client.patch(f"/modules/{module_id}", json={"name": "Python Foundations"},
                        headers=admin_headers)
    assert resp.status_code == 200
    assert resp.json()["name"] == "Python Foundations"


def test_delete_module(client, admin_headers):
    course_id = _get_first_course_id(client)
    module_id = client.get(f"/courses/{course_id}/modules").json()[0]["id"]
    resp = client.delete(f"/modules/{module_id}", headers=admin_headers)
    assert resp.status_code == 204
    remaining = client.get(f"/courses/{course_id}/modules").json()
    assert len(remaining) == 1


def test_reorder_modules(client, admin_headers):
    course_id = _get_first_course_id(client)
    modules = client.get(f"/courses/{course_id}/modules").json()
    ids = [m["id"] for m in modules]
    resp = client.post("/modules/reorder", json={"ids": list(reversed(ids))},
                       headers=admin_headers)
    assert resp.status_code == 200
    new_order = client.get(f"/courses/{course_id}/modules").json()
    assert [m["id"] for m in new_order] == list(reversed(ids))
