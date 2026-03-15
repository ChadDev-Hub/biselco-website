from pydantic import BaseModel, ConfigDict
from uuid import UUID
from typing import List

class GoogleUser(BaseModel):
    user_name: str
    first_name: str
    last_name: str
    email: str
    photo: str
    
    model_config = ConfigDict(from_attributes=True) 


class Roles(BaseModel):
    id:int
    name:str
    
    model_config=ConfigDict(
        from_attributes=True
    )


class UserModel(BaseModel):
    id:UUID
    first_name:str
    last_name:str
    user_name:str
    email:str
    roles:List[Roles]
    photo:str
    
    model_config= ConfigDict(
        from_attributes=True
    )



class Token(BaseModel):
    sub:str
    email:str
    user_id:str
    role:List[str]
    model_config = ConfigDict(from_attributes=True)
    
class AccessToken(BaseModel):
    access_token: str
    token_type: str