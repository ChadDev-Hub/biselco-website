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