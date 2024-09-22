from sqlalchemy.orm import Session
from models import User, Lector, AccessActivity
from schemas import UserCreate, UserUpdate, LectorCreate, LectorUpdate, AccessActivityCreate, AccessActivityUpdate

# ---------------------------
# CRUD para Users
# ---------------------------

def get_users(db: Session):
    return db.query(User).all()

def get_user(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()

def create_user(db: Session, user: UserCreate):
    db_user = User(**user.dict())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user(db: Session, db_user: User, user_update: UserUpdate):
    for key, value in user_update.dict().items():
        setattr(db_user, key, value)
    db.commit()
    db.refresh(db_user)
    return db_user

def delete_user(db: Session, user: User):
    db.delete(user)
    db.commit()

# ---------------------------
# CRUD para Lectors
# ---------------------------

def get_lectors(db: Session):
    return db.query(Lector).all()

def get_lector(db: Session, lector_id: int):
    return db.query(Lector).filter(Lector.id == lector_id).first()

def create_lector(db: Session, lector: LectorCreate):
    db_lector = Lector(**lector.dict())
    db.add(db_lector)
    db.commit()
    db.refresh(db_lector)
    return db_lector

def update_lector(db: Session, db_lector: Lector, lector_update: LectorUpdate):
    for key, value in lector_update.dict().items():
        setattr(db_lector, key, value)
    db.commit()
    db.refresh(db_lector)
    return db_lector

def delete_lector(db: Session, lector: Lector):
    db.delete(lector)
    db.commit()

# ---------------------------
# CRUD para AccessActivity
# ---------------------------

def get_access_activities(db: Session):
    return db.query(AccessActivity).all()

def get_access_activity(db: Session, activity_id: int):
    return db.query(AccessActivity).filter(AccessActivity.id == activity_id).first()

def create_access_activity(db: Session, activity: AccessActivityCreate):
    db_activity = AccessActivity(**activity.dict())
    db.add(db_activity)
    db.commit()
    db.refresh(db_activity)
    return db_activity

def update_access_activity(db: Session, db_activity: AccessActivity, activity_update: AccessActivityUpdate):
    for key, value in activity_update.dict().items():
        setattr(db_activity, key, value)
    db.commit()
    db.refresh(db_activity)
    return db_activity

def delete_access_activity(db: Session, activity: AccessActivity):
    db.delete(activity)
    db.commit()
