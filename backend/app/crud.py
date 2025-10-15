from sqlalchemy.orm import Session
from . import models, schemas

def get_character(db: Session, character: str):
    return db.query(models.Character).filter(models.Character.character == character).first()

def get_characters(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Character).offset(skip).limit(limit).all()

def create_character(db: Session, character: schemas.CharacterCreate):
    db_character = models.Character(**character.dict())
    db.add(db_character)
    db.commit()
    db.refresh(db_character)
    return db_character

def delete_character(db: Session, character_id: int):
    db_character = db.query(models.Character).filter(models.Character.id == character_id).first()
    if db_character:
        db.delete(db_character)
        db.commit()
        return db_character
    return None

def search_characters(db: Session, query: str):
    """Search characters by character, pinyin, or definition"""
    search_term = f"%{query}%"
    return db.query(models.Character).filter(
        (models.Character.character.like(search_term)) |
        (models.Character.pinyin.like(search_term)) |
        (models.Character.definition.like(search_term))
    ).all()