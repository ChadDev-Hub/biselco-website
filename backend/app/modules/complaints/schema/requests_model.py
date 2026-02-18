from pydantic import BaseModel
from uuid import UUID
# COMPLAINTS MODEL
class CreateComplaints(BaseModel):
    subject:str
    description:str
    latitude:float
    longitude:float
    
    
class ComplaintsStatus(BaseModel):
    """
    Complaints Status
    
    :params:
    
       status_name: str
        
        user_id: int
    """
    status_name: str
    user_id: UUID