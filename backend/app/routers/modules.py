# backend/app/routers/modules.py
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Module
from ..auth import require_admin
from ..schemas import ModuleCreate, ModuleUpdate, ModuleOut, ReorderRequest

router = APIRouter()


@router.get("/courses/{course_id}/modules", response_model=list[ModuleOut])
def list_modules(course_id: int, db: Annotated[Session, Depends(get_db)]):
    return db.query(Module).filter(Module.course_id == course_id).order_by(Module.order_index).all()


@router.post("/courses/{course_id}/modules", response_model=ModuleOut, status_code=201)
def create_module(
    course_id: int,
    body: ModuleCreate,
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[object, Depends(require_admin)],
):
    count = db.query(Module).filter(Module.course_id == course_id).count()
    module = Module(course_id=course_id, name=body.name, order_index=count)
    db.add(module)
    db.commit()
    db.refresh(module)
    return module


@router.patch("/modules/{module_id}", response_model=ModuleOut)
def update_module(
    module_id: int,
    body: ModuleUpdate,
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[object, Depends(require_admin)],
):
    module = db.get(Module, module_id)
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")
    if body.name is not None:
        module.name = body.name
    db.commit()
    db.refresh(module)
    return module


@router.delete("/modules/{module_id}", status_code=204)
def delete_module(
    module_id: int,
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[object, Depends(require_admin)],
):
    module = db.get(Module, module_id)
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")
    db.delete(module)
    db.commit()


@router.post("/modules/reorder", response_model=list[ModuleOut])
def reorder_modules(
    body: ReorderRequest,
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[object, Depends(require_admin)],
):
    modules = []
    for idx, module_id in enumerate(body.ids):
        module = db.get(Module, module_id)
        if module:
            module.order_index = idx
            modules.append(module)
    db.commit()
    return sorted(modules, key=lambda m: m.order_index)
