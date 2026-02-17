from pydantic import BaseModel

class UserModel(BaseModel):
    username:str
    user_id:int
    role:str