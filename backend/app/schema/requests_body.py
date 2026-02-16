from pydantic import BaseModel, Field



class ComplaintsStatus(BaseModel):
    """
    Complaints Status
    
    :params:
    
       status_name: str
        
        user_id: int
    """
    status_name: str
    user_id: int
