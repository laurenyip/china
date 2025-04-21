from pydantic import BaseModel
from typing import Optional

class CharacterBase(BaseModel):
    character: str
    pinyin: Optional[str] = None
    jyutping: Optional[str] = None
    definition: Optional[str] = None
    example: Optional[str] = None
    stroke_order: Optional[str] = None
    frequency: Optional[float] = None
    familiarity: Optional[int] = 0

class CharacterCreate(CharacterBase):
    pass

class Character(CharacterBase):
    id: int
    class Config:
        orm_mode = True
