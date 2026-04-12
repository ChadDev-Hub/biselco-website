from pydantic import BaseModel
from uuid import UUID
from typing import List, Optional
class ComplaintStatus(BaseModel):
    id: int
    complaint_id: int
    status_id: int
    name: str
    description: str
    date: str
    time: str
    
class ComplaintStatusHistory(BaseModel):
    id: int
    first_name: str
    last_name:str
    comments: str
    timestamped: str
    user_photo:str

class Location(BaseModel):
    latitude: float
    longitude: float
    srid: int

class ComplaintsModel(BaseModel):
    id: int
    user_id: str
    first_name: str
    last_name: str
    user_photo:str
    subject: str
    description: str
    reference_pole: Optional[str]
    village: str
    municipality: str
    location: Location
    date_time_submitted: str
    status: List[ComplaintStatus]
    latest_status: Optional[str] = None
    status_history: Optional[List[ComplaintStatusHistory]] = None
    resolution_time:Optional[str] = None
    unread_messages: Optional[int] = None


class ComplaintStatusName(BaseModel):
    id: int
    status_name: str
    description: str
    
        
class ComplaintsModelLists(BaseModel):
    data: List[ComplaintsModel]
    total_page:int
    
    
    
class Stat(BaseModel):
    id: int
    title: str
    value: int
    description: str
    
    