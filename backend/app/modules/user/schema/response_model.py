from pydantic import BaseModel


class UserModel(BaseModel):
    first_name:str
    last_name:str
    email:str
    photo:str
    role:str