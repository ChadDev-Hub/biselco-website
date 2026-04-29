from pydantic import BaseModel, ConfigDict, computed_field
from uuid import UUID
from typing import List, Optional
from fastapi import UploadFile
from typing import Optional
from geoalchemy2 import WKTElement
from datetime import datetime
# COMPLAINTS MODEL



class Geometry(BaseModel):
    type: str
    coordinates: List[float]
    srid: int 
    
class CreateComplaints(BaseModel):
    user_id: str
    account_no: str
    issue: str
    details: str
    village: str
    municipality: str 
    geom: str
    imageurl: Optional[str] =None


class Datahistory(BaseModel):
    complaint_id: int
    status_id: int
    user_id: str
    comments: str
    
    model_config = ConfigDict(from_attributes=True)
    @computed_field
    @property
    def timestamped(self) -> datetime:
        return datetime.now()
    
    
    
    
class ComplaintsStatus(BaseModel):
    """
    Complaints Status
    
    :params:
    
       status_name: str
       status_id: int
    """
    status_name: str
    status_id: Optional[int] = None
    