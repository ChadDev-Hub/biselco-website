from pydantic import BaseModel, ConfigDict
from datetime import date, time
from typing import Optional


class AgmaEventSetup(BaseModel):
    title: str
    description:str
    start_date:Optional[date] = None
    end_date: Optional[date] = None
    start_time: Optional[time] = None
    end_time: Optional[time] = None
    
    model_config = ConfigDict(from_attributes=True, arbitrary_types_allowed=True)