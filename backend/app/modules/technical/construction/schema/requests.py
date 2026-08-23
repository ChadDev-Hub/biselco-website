from pydantic import BaseModel
from typing import Literal, Optional, List
from fastapi import UploadFile
from datetime import date, datetime

class NewPrimaryLine(BaseModel):
    uuid: str
    activity: Literal["Line Construction"] = "Line Construction"
    date_accomplished:date 
    type: Literal['Line Extension', 'New Line']
    line_type: Literal['Primary', 'Secondary', 'Underbuilt']
    description: Optional[str] = None
    phasing: str
    pole_assembly: Optional[str] = None
    conductor: str
    neutral: Optional[str] = None
    lat: float
    lon: float
    image: UploadFile
    is_synced: Optional[bool] = None
    datetime_synced: Optional[datetime] = None
    is_deleted: Optional[bool] = None
    datetime_deleted: Optional[datetime] = None
    
    
