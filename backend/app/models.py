from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func
from .database import Base

class Character(Base):
    __tablename__ = "characters"
    id = Column(Integer, primary_key=True, index=True)
    character = Column(String, unique=True, index=True, nullable=False)
    pinyin = Column(String, nullable=True)
    jyutping = Column(String, nullable=True)
    definition = Column(String, nullable=True)
    example = Column(String, nullable=True)
    stroke_order = Column(String, nullable=True)
    frequency = Column(Float, nullable=True)
    familiarity = Column(Integer, default=0)
    created_at = Column(DateTime, default=func.now())
