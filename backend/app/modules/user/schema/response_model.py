from pydantic import BaseModel, ConfigDict
from uuid import UUID
from typing import List, Optional




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
    email:Optional[str] = None
    roles:List[Roles]
    photo:str
    
    model_config= ConfigDict(
        from_attributes=True
    )



class Token(BaseModel):
    sub:str
    email:Optional[str] = None
    user_id:str
    role:List[str]
    model_config = ConfigDict(from_attributes=True)
    
class AccessToken(BaseModel):
    access_token: str
    token_type: str