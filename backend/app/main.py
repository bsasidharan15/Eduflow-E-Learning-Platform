# backend/app/main.py
import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

from .database import engine, SessionLocal, Base
from . import models  # noqa: F401
from .seed import run_seed
from .routers import auth, courses, modules, lessons, resources, students

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables (Alembic handles migrations, this is a safety net)
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        run_seed(db)
    finally:
        db.close()
    yield


app = FastAPI(title="EduFlow API", version="1.0.0", lifespan=lifespan)

# CORS
origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in origins],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(courses.router, prefix="/courses", tags=["courses"])
app.include_router(modules.router, prefix="", tags=["modules"])
app.include_router(lessons.router, prefix="", tags=["lessons"])
app.include_router(resources.router, prefix="/resources", tags=["resources"])
app.include_router(students.router, prefix="/students", tags=["students"])


@app.get("/health")
def health():
    return {"status": "ok"}
