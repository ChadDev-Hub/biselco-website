from pydantic import BaseModel, ConfigDict
from typing import List
from datetime import date, time
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
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    end_time: Optional[time] = None
    start_time: Optional[time] = None
    is_active: Optional[bool] = None
    model_config = ConfigDict(from_attributes=True)
    
    
