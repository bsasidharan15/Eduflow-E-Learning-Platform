# backend/app/storage.py
import os
import uuid

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY", "")
STORAGE_BUCKET = "resources"

_client = None


def _get_client():
    global _client
    if _client is None and SUPABASE_URL and SUPABASE_SERVICE_KEY:
        from supabase import create_client
        _client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
    return _client


def is_configured() -> bool:
    return bool(SUPABASE_URL and SUPABASE_SERVICE_KEY)


def upload_file(file_bytes: bytes, lesson_id: int, filename: str, content_type: str) -> str:
    """Upload to Supabase Storage and return the public URL."""
    client = _get_client()
    path = f"lessons/{lesson_id}/{uuid.uuid4().hex}_{filename}"
    client.storage.from_(STORAGE_BUCKET).upload(
        path, file_bytes, {"content-type": content_type, "upsert": "true"}
    )
    return client.storage.from_(STORAGE_BUCKET).get_public_url(path)


def delete_file(stored_path: str):
    """Delete from Supabase Storage. stored_path is the full public URL."""
    client = _get_client()
    if client is None:
        return
    # Extract the storage path from the URL
    # URL format: .../storage/v1/object/public/{bucket}/{path}
    marker = f"/object/public/{STORAGE_BUCKET}/"
    if marker in stored_path:
        path = stored_path.split(marker, 1)[1]
        client.storage.from_(STORAGE_BUCKET).remove([path])
