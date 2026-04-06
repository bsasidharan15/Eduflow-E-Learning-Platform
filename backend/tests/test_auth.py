# backend/tests/test_auth.py
def test_login_admin_success(client):
    resp = client.post("/auth/login", json={"email": "admin@eduflow.com", "password": "Admin@1234"})
    assert resp.status_code == 200
    data = resp.json()
    assert data["role"] == "admin"
    assert "access_token" in data


def test_login_wrong_password(client):
    resp = client.post("/auth/login", json={"email": "admin@eduflow.com", "password": "wrong"})
    assert resp.status_code == 401


def test_login_unknown_email(client):
    resp = client.post("/auth/login", json={"email": "nobody@x.com", "password": "Admin@1234"})
    assert resp.status_code == 401


def test_get_me(client, admin_headers):
    resp = client.get("/auth/me", headers=admin_headers)
    assert resp.status_code == 200
    assert resp.json()["role"] == "admin"
