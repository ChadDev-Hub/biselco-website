from pydantic import BaseModel
from uuid import UUID
from typing import List

class UserModel(BaseModel):
    user_id:UUID
    user_name:str
    first_name:str
    last_name:str
    email:str
    photo:str
    role:list


class Token(BaseModel):
    sub:str
    email:str
    user_id:UUID
    role:str
    
class AccessToken(BaseModel):
    access_token: str
    token_type: str