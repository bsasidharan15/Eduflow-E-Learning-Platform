# backend/app/routers/lessons.py
import os
import shutil
import uuid
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session, selectinload
from ..database import get_db
from ..models import Lesson, LessonResource
from ..auth import require_admin
from ..schemas import LessonCreate, LessonUpdate, LessonOut, ReorderRequest, LessonResourceOut

router = APIRouter()

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")


def _lesson_upload_dir(lesson_id: int) -> str:
    path = os.path.join(UPLOAD_DIR, "lessons", str(lesson_id))
    os.makedirs(path, exist_ok=True)
    return path


def _get_lesson_with_resources(db: Session, lesson_id: int) -> Lesson:
    lesson = (
        db.query(Lesson)
        .options(selectinload(Lesson.resources))
        .filter(Lesson.id == lesson_id)
        .first()
    )
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    return lesson


@router.get("/modules/{module_id}/lessons", response_model=list[LessonOut])
def list_lessons(module_id: int, db: Annotated[Session, Depends(get_db)]):
    return (
        db.query(Lesson)
        .options(selectinload(Lesson.resources))
        .filter(Lesson.module_id == module_id)
        .order_by(Lesson.order_index)
        .all()
    )


@router.get("/lessons/{lesson_id}", response_model=LessonOut)
def get_lesson(lesson_id: int, db: Annotated[Session, Depends(get_db)]):
    return _get_lesson_with_resources(db, lesson_id)


@router.post("/modules/{module_id}/lessons", response_model=LessonOut, status_code=201)
def create_lesson(
    module_id: int,
    body: LessonCreate,
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[object, Depends(require_admin)],
):
    count = db.query(Lesson).filter(Lesson.module_id == module_id).count()
    lesson = Lesson(module_id=module_id, title=body.title, youtube_url=body.youtube_url,
                    order_index=count)
    db.add(lesson)
    db.commit()
    return _get_lesson_with_resources(db, lesson.id)


@router.patch("/lessons/{lesson_id}", response_model=LessonOut)
def update_lesson(
    lesson_id: int,
    body: LessonUpdate,
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[object, Depends(require_admin)],
):
    lesson = db.get(Lesson, lesson_id)
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    if body.title is not None:
        lesson.title = body.title
    if body.youtube_url is not None:
        lesson.youtube_url = body.youtube_url
    db.commit()
    return _get_lesson_with_resources(db, lesson_id)


@router.delete("/lessons/{lesson_id}", status_code=204)
def delete_lesson(
    lesson_id: int,
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[object, Depends(require_admin)],
):
    lesson = db.get(Lesson, lesson_id)
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    db.delete(lesson)
    db.commit()


@router.post("/lessons/reorder", response_model=list[LessonOut])
def reorder_lessons(
    body: ReorderRequest,
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[object, Depends(require_admin)],
):
    lessons = []
    for idx, lesson_id in enumerate(body.ids):
        lesson = db.get(Lesson, lesson_id)
        if lesson:
            lesson.order_index = idx
            lessons.append(lesson)
    db.commit()
    return sorted(lessons, key=lambda l: l.order_index)


@router.post("/lessons/{lesson_id}/resources", response_model=LessonResourceOut, status_code=201)
def upload_resource(
    lesson_id: int,
    file: Annotated[UploadFile, File(...)],
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[object, Depends(require_admin)],
):
    upload_dir = _lesson_upload_dir(lesson_id)
    safe_name = f"{uuid.uuid4().hex}_{file.filename}"
    stored_path = os.path.join(upload_dir, safe_name)
    with open(stored_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    resource = LessonResource(
        lesson_id=lesson_id,
        original_filename=file.filename,
        stored_path=stored_path,
    )
    db.add(resource)
    db.commit()
    db.refresh(resource)
    return resource
