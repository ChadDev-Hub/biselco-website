from typing import Optional
from pydantic import BaseModel, EmailStr
from fastapi import Form



# SIGN UP PYDANTIC MODEL
class SignUpUser(BaseModel):
    username: str
    firstname:str
    lastname:str
    email: EmailStr
    password: str 

# LOGIN MODEL
class LoginUser(BaseModel):
    username:str
    password:str
    
class TokenData(BaseModel):
    access_token:str
    token_type:str

#  METER ACCOUNT MODEL
class CreatMeterAccount(BaseModel):
    accountno: int
    consumername: str
    consumertype: str
    village:str
    municipality:str
    mobileno: str

# NEWS MODEL
class CreateNews(BaseModel):
    title:str
    description:str
    