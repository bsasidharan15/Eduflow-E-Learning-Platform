# backend/app/routers/resources.py
import os
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import LessonResource
from ..auth import require_admin

router = APIRouter()


@router.get("/{resource_id}/download")
def download_resource(resource_id: int, db: Annotated[Session, Depends(get_db)]):
    resource = db.get(LessonResource, resource_id)
    if not resource or not os.path.exists(resource.stored_path):
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
    if os.path.exists(resource.stored_path):
        os.remove(resource.stored_path)
    db.delete(resource)
    db.commit()
