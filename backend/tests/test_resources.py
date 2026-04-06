# backend/tests/test_resources.py
import io


def _get_first_lesson_id(client):
    course_id = client.get("/courses").json()[0]["id"]
    module_id = client.get(f"/courses/{course_id}/modules").json()[0]["id"]
    return client.get(f"/modules/{module_id}/lessons").json()[0]["id"]


def test_upload_resource(client, admin_headers):
    lesson_id = _get_first_lesson_id(client)
    resp = client.post(
        f"/lessons/{lesson_id}/resources",
        files={"file": ("test.pdf", io.BytesIO(b"PDF content here"), "application/pdf")},
        headers=admin_headers,
    )
    assert resp.status_code == 201
    assert resp.json()["original_filename"] == "test.pdf"


def test_download_resource(client, admin_headers):
    lesson_id = _get_first_lesson_id(client)
    upload_resp = client.post(
        f"/lessons/{lesson_id}/resources",
        files={"file": ("notes.pdf", io.BytesIO(b"notes"), "application/pdf")},
        headers=admin_headers,
    )
    resource_id = upload_resp.json()["id"]
    download_resp = client.get(f"/resources/{resource_id}/download")
    assert download_resp.status_code == 200
    assert download_resp.content == b"notes"


def test_delete_resource(client, admin_headers):
    lesson_id = _get_first_lesson_id(client)
    upload_resp = client.post(
        f"/lessons/{lesson_id}/resources",
        files={"file": ("del.pdf", io.BytesIO(b"delete me"), "application/pdf")},
        headers=admin_headers,
    )
    resource_id = upload_resp.json()["id"]
    del_resp = client.delete(f"/resources/{resource_id}", headers=admin_headers)
    assert del_resp.status_code == 204
    lesson_resp = client.get(f"/lessons/{lesson_id}")
    assert all(r["id"] != resource_id for r in lesson_resp.json()["resources"])
