from pydantic import BaseModel
from uuid import UUID
from typing import List, Optional
from fastapi import UploadFile
from typing import Optional
# COMPLAINTS MODEL
class CreateComplaints(BaseModel):
    accountNumber: str
    issue: str
    details: str
    lon: float
    lat: float
    
    
    
class ComplaintsStatus(BaseModel):
    """
    Complaints Status
    
    :params:
    
       status_name: str
       status_id: int
    """
    status_name: str
    status_id: Optional[int] = None
    