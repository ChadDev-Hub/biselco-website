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
    village: str
    municipality: str
    location: Location
    date_time_submitted: str
    status: list[ComplaintStatus]
    latest_status: Optional[str] = None


class ComplaintStatusName(BaseModel):
    id: int
    status_name: str
    description: str