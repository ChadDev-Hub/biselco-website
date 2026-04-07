from pydantic import BaseModel, ConfigDict
from typing import Optional

class User(BaseModel):
    id: Optional[str]
    first_name: Optional[str]
    last_name: Optional[str]
    photo: Optional[str]
    
    model_config = ConfigDict(from_attributes=True)
    
class Message(BaseModel):
    id: int
    complaints_id: int
    sender: User
    receiver: Optional[User] = None
    sender_status: str
    receiver_status: str
    message: str
    date: str
    time: str
    
    model_config = ConfigDict(from_attributes=True)
    
class SeenMessage(BaseModel):
    id: int;
    receiver_status: str;
    receiver_id: Optional[str] = None;