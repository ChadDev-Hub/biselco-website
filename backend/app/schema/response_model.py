from pydantic import BaseModel
from typing import Optional, Dict
import uuid
class UserModel(BaseModel):
    first_name:str
    last_name:str
    email:str
    photo:str
    role:str
    
    
class ComplaintsModel(BaseModel):
    id:int
    location:Optional["Location"]


class Location(BaseModel):
    latitude:float
    longitude:float
    srid:int