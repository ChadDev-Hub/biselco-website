from pydantic import BaseModel
from typing import Literal, Optional, List
from fastapi import UploadFile
from datetime import date, datetime

class NewPrimaryLine(BaseModel):
    uuid: str
    const_uuid: str
    activity: Literal["Line Construction"] = "Line Construction"
    date_accomplished:date 
    type: Literal['Line Extension', 'New Line']
    line_type: Literal['Primary', 'Secondary', 'Underbuilt']
    description: Optional[str] = None
    phasing: str
    pole_assembly: Optional[str] = None
    conductor: int
    neutral: Optional[int] = None
    lat: float
    lon: float
    image: UploadFile
    is_deleted: Optional[bool] = None
    datetime_deleted: Optional[datetime] = None
    
    
