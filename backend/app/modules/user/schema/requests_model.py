from pydantic import BaseModel, EmailStr

# SIGN UP PYDANTIC MODEL
class SignUpUser(BaseModel):
    firstname:str
    lastname:str
    email: EmailStr
    password: str
    

# LOGIN MODEL
class LoginUser(BaseModel):
    username:str
    password:str
    