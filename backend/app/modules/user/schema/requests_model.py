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


# GOOGLE LOGIN REQUESTS
class GoogleLogin(BaseModel):
    token: str
    
    
# REFRESH TOKEN MODEL 
class RefreshToken(BaseModel):
    refresh_token: str
    
    
class AccessToken(BaseModel):
    access_token: str
    type: str