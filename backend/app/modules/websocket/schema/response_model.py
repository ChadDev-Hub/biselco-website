from pydantic import BaseModel, ConfigDict


class User(BaseModel):
    id: str
    first_name: str
    last_name: str
    photo: str

class Message(BaseModel):
    id: int
    complaints_id: int
    sender: User
    receiver: User
    sender_status: str
    receiver_status: str
    message: str
    date: str
    time: str
    
    model_config = ConfigDict(from_attributes=True)
    
    