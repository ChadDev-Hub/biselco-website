from pydantic import BaseModel, ConfigDict, computed_field
from uuid import UUID
from typing import List, Optional
from datetime import datetime
import pytz
from geoalchemy2.elements import WKBElement
class ComplaintStatus(BaseModel):
    id: int
    complaint_id: int
    status_id: int
    name: str
    description: str
    date: str
    time: str
    
    
    model_config = ConfigDict(from_attributes=True)
    
    
class StatusHistory(BaseModel):
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
class ComplaintsImages(BaseModel):
    id:int
    url:str
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
    status_history: Optional[List[StatusHistory]] = None
    images: Optional[List[ComplaintsImages]] = None
    resolution_time:Optional[str] = None
    unread_messages: Optional[int] = None
    
class NewComplaintStatus(BaseModel):
    complaint_id: int
    status: List[ComplaintStatus]
    latest_status: Optional[str] = None
    status_history: Optional[List[StatusHistory]] = None

class ComplaintStatusName(BaseModel):
    id: int
    status_name: str
    description: str
    
        
class ComplaintsModelLists(BaseModel):
    data: List[ComplaintsModel]
    total_page:int
    
class NewComplaintsModel(BaseModel):
    data: ComplaintsModel
    total_page:int
    
class Stat(BaseModel):
    id: int
    title: str
    value: int
    description: str
    

# class ComplaintHistoryModel(BaseModel):
#     id: int
#     user_id: str
#     first_name: str
#     last_name: str
#     user_photo:str
#     subject: str
#     description: str
#     reference_pole: Optional[str]
#     village: str
#     municipality: str
#     location: Location
#     date_time_submitted: str
#     status: List[ComplaintStatus]
#     latest_status: Optional[str] = None
#     status_history: Optional[List[StatusHistory]] = None
#     resolution_time:Optional[str] = None