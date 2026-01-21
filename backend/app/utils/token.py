from datetime import datetime, timedelta, timezone
from fastapi import Depends, HTTPException, status, Response
from fastapi.security import OAuth2PasswordBearer
import jwt
from jwt.exceptions import InvalidTokenError
import os
from dotenv import load_dotenv
load_dotenv()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 7 


async def create_access_token(data:dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp" : expire, "type": "access_token"})
    encoded_jwt = jwt.encode(payload=to_encode,key=SECRET_KEY,algorithm=ALGORITHM)
    return encoded_jwt

async def create_refresh_token(data:dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire, "type": "refresh_token"})
    refresh_token = jwt.encode(payload=to_encode, key=SECRET_KEY, algorithm=ALGORITHM)
    return refresh_token


async def get_current_user(token:str = Depends(oauth2_scheme)):
    credential_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Incorrect username or password",
        headers={"WWW-Authenticate" : "Bearer"}
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=ALGORITHM)
        user_name = payload.get("sub")
        user_id = payload.get("id")
        if user_name is None or user_id is None:
            raise credential_exception
        return {
            "username": user_name,
            "userid": user_id
        }
    except InvalidTokenError:
        raise credential_exception
    
