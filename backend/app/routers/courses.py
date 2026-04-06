# backend/app/routers/courses.py
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Course
from ..auth import require_admin
from ..schemas import CourseCreate, CourseUpdate, CourseOut, ReorderRequest

router = APIRouter()


@router.get("", response_model=list[CourseOut])
def list_courses(db: Annotated[Session, Depends(get_db)]):
    return db.query(Course).order_by(Course.order_index).all()


@router.post("", response_model=CourseOut, status_code=201)
def create_course(
    body: CourseCreate,
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[object, Depends(require_admin)],
):
    max_order = db.query(Course).count()
    course = Course(name=body.name, description=body.description, order_index=max_order)
    db.add(course)
    db.commit()
    db.refresh(course)
    return course


@router.patch("/{course_id}", response_model=CourseOut)
def update_course(
    course_id: int,
    body: CourseUpdate,
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[object, Depends(require_admin)],
):
    course = db.get(Course, course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    if body.name is not None:
        course.name = body.name
    if body.description is not None:
        course.description = body.description
    db.commit()
    db.refresh(course)
    return course


@router.delete("/{course_id}", status_code=204)
def delete_course(
    course_id: int,
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[object, Depends(require_admin)],
):
    course = db.get(Course, course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    db.delete(course)
    db.commit()


@router.post("/reorder", response_model=list[CourseOut])
def reorder_courses(
    body: ReorderRequest,
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[object, Depends(require_admin)],
):
    for idx, course_id in enumerate(body.ids):
        course = db.get(Course, course_id)
        if course:
            course.order_index = idx
    db.commit()
    return db.query(Course).order_by(Course.order_index).all()
