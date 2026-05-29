from pydantic import BaseModel, ConfigDict
from typing import List
from datetime import date, time, datetime
from typing import Optional
class AbrevationStyle(BaseModel):
    char: str
    color: str
    model_config = ConfigDict(from_attributes=True)
class AgmaEvent(BaseModel):
    id: int
    title: str
    description: str
    date_end: float
    qoute_title: str
    qoute_description: str
    footer: str
    image_src: str
    abrevation: List[AbrevationStyle]
    model_config = ConfigDict(from_attributes=True)
    
    
class EventSchedule(BaseModel):
    id:Optional[str] = None
    event_id: Optional[int] = None
    area: Optional[str] = None
    event_location: Optional[str] = None
    event_date: Optional[datetime] = None