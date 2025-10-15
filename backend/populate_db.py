from sqlalchemy.orm import Session
from app import models, database, schemas
from app.hsk1_words import hsk1_words

def populate_database():
    """Populate the database with HSK1 words"""
    db = database.SessionLocal()

    # Check if database is already populated
    existing_count = db.query(models.Character).count()
    if existing_count > 0:
        print(f"Database already has {existing_count} characters")
        db.close()
        return

    print(f"Populating database with {len(hsk1_words)} HSK1 words...")

    for word in hsk1_words:
        db_character = models.Character(
            character=word['character'],
            pinyin=word['pinyin'],
            definition=word['definition']
        )
        db.add(db_character)

    db.commit()
    print("Database populated successfully!")

    db.close()

if __name__ == "__main__":
    populate_database()
