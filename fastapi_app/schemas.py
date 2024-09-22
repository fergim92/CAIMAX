from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

# Schemas para User
class UserBase(BaseModel):
    name: str
    email: str

class UserCreate(UserBase):
    pass

class UserUpdate(UserBase):
    pass

class UserOut(UserBase):
    id: int
    class Config:
        orm_mode = True

# Schemas para Lector
class LectorBase(BaseModel):
    role_user_required: int
    name: str
    location: str
    status: str

class LectorCreate(LectorBase):
    pass

class LectorUpdate(LectorBase):
    pass

class LectorOut(LectorBase):
    id: int
    class Config:
        orm_mode = True

# Schemas para AccessActivity
class AccessActivityBase(BaseModel):
    user_id: int
    lector_id: int
    datetime: datetime
    exit_datetime: Optional[datetime]
    access_type: str
    event: str

class AccessActivityCreate(AccessActivityBase):
    pass

class AccessActivityUpdate(AccessActivityBase):
    pass

class AccessActivityOut(AccessActivityBase):
    id: int
    class Config:
        orm_mode = True
