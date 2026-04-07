# backend/app/routers/resources.py
import os
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse, RedirectResponse
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import LessonResource
from ..auth import require_admin
from .. import storage

router = APIRouter()


@router.get("/{resource_id}/download")
def download_resource(resource_id: int, db: Annotated[Session, Depends(get_db)]):
    resource = db.get(LessonResource, resource_id)
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")

    # Supabase Storage: redirect to public URL
    if resource.stored_path.startswith("http"):
        return RedirectResponse(url=resource.stored_path)

    # Local filesystem
    if not os.path.exists(resource.stored_path):
        raise HTTPException(status_code=404, detail="Resource not found")
    return FileResponse(
        path=resource.stored_path,
        filename=resource.original_filename,
        media_type="application/octet-stream",
    )


@router.delete("/{resource_id}", status_code=204)
def delete_resource(
    resource_id: int,
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[object, Depends(require_admin)],
):
    resource = db.get(LessonResource, resource_id)
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")

    if resource.stored_path.startswith("http"):
        storage.delete_file(resource.stored_path)
    elif os.path.exists(resource.stored_path):
        os.remove(resource.stored_path)

    db.delete(resource)
    db.commit()
