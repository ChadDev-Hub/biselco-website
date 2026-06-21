from pydantic import BaseModel, ConfigDict, BeforeValidator
from typing import List
from datetime import date, time, datetime
from typing import Optional, Annotated

nullable_str = Annotated[Optional[str], BeforeValidator(lambda v: v or None)]

class AbrevationStyle(BaseModel):
    char: str
    color: str
    model_config = ConfigDict(from_attributes=True)
class AgmaEvent(BaseModel):
    id: int
    title: str
    description: str
    target_date: float
    is_active: bool
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
    event_date: Optional[str] = None
    
class AgmaEventSchedules(BaseModel):
    id:Optional[str] = None
    area: Optional[str] = None
    location: nullable_str
    date: nullable_str
    time: nullable_str
    image: nullable_str