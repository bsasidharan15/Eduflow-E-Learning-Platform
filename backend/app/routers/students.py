# backend/app/routers/students.py
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User
from ..auth import hash_password, require_admin
from ..schemas import StudentCreate, UserOut

router = APIRouter()


@router.get("", response_model=list[UserOut])
def list_students(
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[object, Depends(require_admin)],
):
    return db.query(User).filter(User.role == "student").order_by(User.created_at).all()


@router.post("", response_model=UserOut, status_code=201)
def create_student(
    body: StudentCreate,
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[object, Depends(require_admin)],
):
    if db.query(User).filter(User.email == body.email).first():
        raise HTTPException(status_code=409, detail="Email already registered")
    student = User(
        email=body.email,
        full_name=body.full_name,
        password_hash=hash_password(body.password),
        role="student",
    )
    db.add(student)
    db.commit()
    db.refresh(student)
    return student


@router.delete("/{student_id}", status_code=204)
def delete_student(
    student_id: int,
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[object, Depends(require_admin)],
):
    student = db.get(User, student_id)
    if not student or student.role != "student":
        raise HTTPException(status_code=404, detail="Student not found")
    db.delete(student)
    db.commit()
