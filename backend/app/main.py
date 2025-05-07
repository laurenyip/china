from fastapi import FastAPI, Depends, HTTPException
from . import models, crud, schemas, database
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from app.hsk1_words import hsk1_words
import random

app = FastAPI()

print("main.py is running")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

from app.hsk1_words import hsk1_words


@app.get("/")
def read_root():
    return {"message": "Chinese Learning API is running!"}

@app.get("/suggest", response_model=schemas.CharacterBase)
def suggest_word(db: Session = Depends(get_db)):
    # Suggest a word not already in the user's known repo
    known = [c.character for c in crud.get_characters(db)]
    candidates = [w for w in hsk1_words if w["character"] not in known]
    if not candidates:
        raise HTTPException(status_code=404, detail="No new words to suggest!")
    word = random.choice(candidates)
    return schemas.CharacterBase(**word)

@app.post("/add", response_model=schemas.Character)
def add_word(word: schemas.CharacterCreate, db: Session = Depends(get_db)):
    db_word = crud.get_character(db, word.character)
    if db_word:
        raise HTTPException(status_code=400, detail="Word already known!")
    return crud.create_character(db, word)

@app.get("/characters", response_model=List[schemas.Character])
def get_characters(db: Session = Depends(get_db)):
    return crud.get_characters(db)

@app.delete("/characters/{id}", response_model=schemas.Character)
def delete_character(id: int, db: Session = Depends(get_db)):
    deleted = crud.delete_character(db, id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Character not found")
    return deleted


