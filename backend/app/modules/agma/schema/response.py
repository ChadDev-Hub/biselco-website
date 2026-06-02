from pydantic import BaseModel
from typing import Optional
from datetime import date, time




class AgmaSetup(BaseModel):
    id: int
    title:str
    description:str
    start_date:Optional[date] = None
    end_date: Optional[date] = None
    start_time: Optional[time] = None
    end_time: Optional[time] = None
    is_active: Optional[bool] = None
    
class AgmaCountRegistered(BaseModel):
    name: Optional[str] = None
    value: Optional[int] = None

class RegisteredOvertime(BaseModel):
    name: Optional[date] = None
    coron: Optional[int] = None
    culion: Optional[int] = None
    busuanga: Optional[int] = None
    linapacan: Optional[int] = None

class AgmaStats(BaseModel):
    title: str
    value:  float | int | str | None = None
    description: Optional[str] = None
    is_percentage: Optional[bool] = None

