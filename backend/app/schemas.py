# backend/app/schemas.py
from datetime import datetime
from pydantic import BaseModel


# ── Auth ──────────────────────────────────────────────────────────────────────

class LoginRequest(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    role: str
    user_id: int
    full_name: str


class UserOut(BaseModel):
    id: int
    email: str
    full_name: str
    role: str
    created_at: datetime

    model_config = {"from_attributes": True}


# ── Courses ───────────────────────────────────────────────────────────────────

class CourseCreate(BaseModel):
    name: str
    description: str | None = None


class CourseUpdate(BaseModel):
    name: str | None = None
    description: str | None = None


class CourseOut(BaseModel):
    id: int
    name: str
    description: str | None
    order_index: int
    created_at: datetime

    model_config = {"from_attributes": True}


class ReorderRequest(BaseModel):
    ids: list[int]  # ordered list of IDs — index becomes order_index


# ── Modules ───────────────────────────────────────────────────────────────────

class ModuleCreate(BaseModel):
    name: str


class ModuleUpdate(BaseModel):
    name: str | None = None


class ModuleOut(BaseModel):
    id: int
    course_id: int
    name: str
    order_index: int
    created_at: datetime

    model_config = {"from_attributes": True}


# ── Lessons ───────────────────────────────────────────────────────────────────

class LessonCreate(BaseModel):
    title: str
    youtube_url: str


class LessonUpdate(BaseModel):
    title: str | None = None
    youtube_url: str | None = None


class LessonResourceOut(BaseModel):
    id: int
    lesson_id: int
    original_filename: str
    created_at: datetime

    model_config = {"from_attributes": True}


class LessonOut(BaseModel):
    id: int
    module_id: int
    title: str
    youtube_url: str
    order_index: int
    created_at: datetime
    resources: list[LessonResourceOut] = []

    model_config = {"from_attributes": True}


# ── Students ──────────────────────────────────────────────────────────────────

class StudentCreate(BaseModel):
    email: str
    full_name: str
    password: str
