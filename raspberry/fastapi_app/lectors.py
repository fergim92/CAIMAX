from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from crud import get_lectors, get_lector, create_lector, delete_lector, update_lector
from schemas import LectorCreate, LectorOut, LectorUpdate
from database import get_db
from typing import List

router = APIRouter(prefix="/lectors", tags=["Lectors"])

# Obtener todos los lectores
@router.get("/", response_model=List[LectorOut])
def read_lectors(db: Session = Depends(get_db)):
    return get_lectors(db)

# Obtener un lector por ID
@router.get("/{lector_id}", response_model=LectorOut)
def read_lector(lector_id: int, db: Session = Depends(get_db)):
    lector = get_lector(db, lector_id)
    if not lector:
        raise HTTPException(status_code=404, detail="Lector not found")
    return lector

# Crear un nuevo lector
@router.post("/", response_model=LectorOut)
def create_new_lector(lector: LectorCreate, db: Session = Depends(get_db)):
    return create_lector(db, lector)

# Actualizar un lector existente
@router.put("/{lector_id}", response_model=LectorOut)
def update_existing_lector(lector_id: int, lector: LectorUpdate, db: Session = Depends(get_db)):
    db_lector = get_lector(db, lector_id)
    if not db_lector:
        raise HTTPException(status_code=404, detail="Lector not found")
    return update_lector(db, db_lector, lector)

# Eliminar un lector
@router.delete("/{lector_id}")
def delete_existing_lector(lector_id: int, db: Session = Depends(get_db)):
    lector = get_lector(db, lector_id)
    if not lector:
        raise HTTPException(status_code=404, detail="Lector not found")
    delete_lector(db, lector)
    return {"message": "Lector deleted successfully"}
