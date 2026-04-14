from pydantic import BaseModel, ConfigDict
from typing import Optional
from uuid import UUID

class User(BaseModel):
    id: Optional[str]
    first_name: Optional[str]
    last_name: Optional[str]
    photo: Optional[str]
    
    model_config = ConfigDict(from_attributes=True)
    
class Message(BaseModel):
    id: str
    complaints_id: int
    sender: User
    receiver: Optional[User] = None
    sender_status: str
    receiver_status: str
    message: str
    date: str
    time: str
    
    model_config = ConfigDict(from_attributes=True)
    
class UnreadMessages(BaseModel):
    complaints_id: int
    unread_messages: int
    sender_id: str
    
class SeenMessage(BaseModel):
    id: str
    complaints_id: int
    receiver_status: str
    receiver_id: Optional[str] = None