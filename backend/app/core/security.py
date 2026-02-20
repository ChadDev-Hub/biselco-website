from datetime import datetime, timedelta, timezone
from fastapi import Depends, HTTPException, status, Response, Request, WebSocket
from fastapi.security import OAuth2PasswordBearer
import jwt
from jwt.exceptions import InvalidTokenError
import os
from dotenv import load_dotenv
from google.oauth2 import id_token
from google.auth.transport import requests
from ..modules.user.schema.response_model import Token
load_dotenv()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/v1/auth/token")
SECRET_KEY = os.getenv("SECRET_KEY") 
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = 1
REFRESH_TOKEN_EXPIRE_DAYS = 7
G_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
G_SECRET = os.getenv("GOOGLE_CLIENT_SECRET") 


# CREATE ACCESS TOKEN
async def create_access_token(data:dict):
    if not SECRET_KEY:
        raise ValueError("No secret key")
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp" : expire, "type": "access_token"})
    encoded_jwt = jwt.encode(payload=to_encode,key=SECRET_KEY,algorithm=ALGORITHM)
    return encoded_jwt

# CREATE REFRESH TOKEN
async def create_refresh_token(data:dict):
    if not SECRET_KEY:
        raise ValueError("No secret key")
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire, "type": "refresh_token"})
    refresh_token = jwt.encode(payload=to_encode, key=SECRET_KEY, algorithm=ALGORITHM)
    return refresh_token


# VERIFY TOKEN 
async def verify_token(token):
    if not SECRET_KEY:
        raise ValueError("No secret key")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        sub = payload.get("sub")
        email = payload.get("email")
        user_id = payload.get("user_id")
        role = payload.get("role")
        return {
            "sub": sub,
            "email": email,
            "user_id": user_id,
            "role": role
        }
    except jwt.ExpiredSignatureError:
        raise
    except jwt.PyJWTError:
        return None

# GET CURRENT USER
async def get_current_user(token:str = Depends(oauth2_scheme)):
    if not SECRET_KEY:
        raise ValueError("No secret key")
    credential_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid Credential",
        headers={"WWW-Authenticate" : "Bearer"}
    )
    if not token:
        raise credential_exception
    try:
        current_user = await verify_token(token)
        if not current_user:
            raise credential_exception
        if current_user.get("sub") != "access_token":
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid Token")
        return current_user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Access token expired")


# WEBSOCKET VERIFY CURRENT USER
async def get_current_user_ws(websocket:WebSocket):
    if not SECRET_KEY:
        raise ValueError("No secret key")
    token = websocket.cookies.get("refresh_token")
    if not token:
        return None
    try:
        paload = jwt.decode(token,SECRET_KEY,algorithms=[ALGORITHM])
        if paload.get("sub") != "refresh_token":
            return None
        return {
            "sub": paload.get("sub"),
            "email": paload.get("email"),
            "user_id": paload.get("user_id"),
            "role": paload.get("role")
        }
    except jwt.PyJWTError:
        return None
    
# VERIFY GOOGLE LOGIN
async def verify_google_login(token:str):
    if not token:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Token Not Found")
    idinfo = id_token.verify_oauth2_token(token, requests.Request(), G_CLIENT_ID)
    username= idinfo["sub"]
    email = idinfo["email"]
    first_name = idinfo["given_name"]
    last_name = idinfo["family_name"]
    pricture = idinfo['picture']

    return {
        "username": f"BIS{username}",
        "email": email,
        "first_name": first_name,
        "last_name": last_name,
        "picture": pricture
    }