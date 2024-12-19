from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from crud import (
    get_access_activities, 
    get_access_activity, 
    create_access_activity, 
    update_access_activity, 
    delete_access_activity
)
from schemas import AccessActivityCreate, AccessActivityOut, AccessActivityUpdate
from database import get_db

# Crear el router para el módulo access_activity
router = APIRouter(
    prefix="/access_activity",
    tags=["Access Activity"]
)

# Obtener todas las actividades de acceso
@router.get("/", response_model=list[AccessActivityOut])
def read_access_activities(db: Session = Depends(get_db)):
    return get_access_activities(db)

# Obtener una actividad de acceso específica por ID
@router.get("/{activity_id}", response_model=AccessActivityOut)
def read_access_activity(activity_id: int, db: Session = Depends(get_db)):
    activity = get_access_activity(db, activity_id)
    if not activity:
        raise HTTPException(status_code=404, detail="Access activity not found")
    return activity

# Crear una nueva actividad de acceso
@router.post("/", response_model=AccessActivityOut)
def create_new_access_activity(activity: AccessActivityCreate, db: Session = Depends(get_db)):
    return create_access_activity(db, activity)

# Actualizar una actividad de acceso existente
@router.put("/{activity_id}", response_model=AccessActivityOut)
def update_existing_access_activity(activity_id: int, activity: AccessActivityUpdate, db: Session = Depends(get_db)):
    db_activity = get_access_activity(db, activity_id)
    if not db_activity:
        raise HTTPException(status_code=404, detail="Access activity not found")
    return update_access_activity(db, db_activity, activity)

# Eliminar una actividad de acceso existente
@router.delete("/{activity_id}")
def delete_existing_access_activity(activity_id: int, db: Session = Depends(get_db)):
    activity = get_access_activity(db, activity_id)
    if not activity:
        raise HTTPException(status_code=404, detail="Access activity not found")
    delete_access_activity(db, activity)
    return {"message": "Access activity deleted successfully"}
