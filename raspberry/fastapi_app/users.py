from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from crud import get_users, get_user, create_user, delete_user, update_user
from schemas import UserCreate, UserOut, UserUpdate
from database import get_db
from typing import List

router = APIRouter(prefix="/users", tags=["Users"])

# Obtener todos los usuarios
@router.get("/", response_model=List[UserOut])
def read_users(db: Session = Depends(get_db)):
    return get_users(db)

# Obtener un usuario por ID
@router.get("/{user_id}", response_model=UserOut)
def read_user(user_id: int, db: Session = Depends(get_db)):
    user = get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# Crear un nuevo usuario
@router.post("/", response_model=UserOut)
def create_new_user(user: UserCreate, db: Session = Depends(get_db)):
    return create_user(db, user)

# Actualizar un usuario existente
@router.put("/{user_id}", response_model=UserOut)
def update_existing_user(user_id: int, user: UserUpdate, db: Session = Depends(get_db)):
    db_user = get_user(db, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return update_user(db, db_user, user)

# Eliminar un usuario
@router.delete("/{user_id}")
def delete_existing_user(user_id: int, db: Session = Depends(get_db)):
    user = get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    delete_user(db, user)
    return {"message": "User deleted successfully"}
