from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional
# SIGN UP PYDANTIC MODEL



class SignUpUser(BaseModel):
    
    user_name: Optional[str] = None
    first_name: str
    last_name: str
    email: Optional[EmailStr] = None
    photo: Optional[str] = None
    provider_token: Optional[str] = None
    provider_id: str
    hash: str
    provider: str
    model_config = ConfigDict(from_attributes=True) 

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
    
