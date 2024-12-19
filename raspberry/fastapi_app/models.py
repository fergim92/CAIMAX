from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    last_name = Column(String, index=True)
    dni = Column(String, unique=True, index=True)
    fingerprint = Column(LargeBinary, nullable=True)  
    rfid = Column(String, nullable=True)
    role = Column(Integer, nullable=False)
    tag_rfid = Column(String, nullable=True)
    access_activities = relationship("AccessActivity", back_populates="user")


class Lector(Base):
    __tablename__ = "lectors"
    id = Column(Integer, primary_key=True, index=True)
    role_user_required = Column(Integer, nullable=False)
    name = Column(String, nullable=False)
    location = Column(String, nullable=False)
    status = Column(String, nullable=False)
    access_activities = relationship("AccessActivity", back_populates="lector")

class AccessActivity(Base):
    __tablename__ = "access_activity"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    lector_id = Column(Integer, ForeignKey('lectors.id'), nullable=False)
    datetime = Column(DateTime, nullable=False)
    exit_datetime = Column(DateTime, nullable=True)
    access_type = Column(String, nullable=False)
    event = Column(String, nullable=False)
    user = relationship("User", back_populates="access_activities")
    lector = relationship("Lector", back_populates="access_activities")
