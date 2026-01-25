from datetime import datetime, timedelta, timezone
from fastapi import Depends, HTTPException, status, Response, Request
from fastapi.security import OAuth2PasswordBearer
import jwt
from jwt.exceptions import InvalidTokenError
import os
from dotenv import load_dotenv
load_dotenv()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = 1
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


async def get_current_user(requests:Request, response:Response):
    token = requests.cookies.get("access_token")
    refresh_token = requests.cookies.get("access_token")
    credential_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid Credential",
        headers={"WWW-Authenticate" : "Bearer"}
    )
    if not token:
        raise credential_exception
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_name = payload.get("sub")
        user_id = payload.get("id")
        return {
            "username": user_name,
            "userid": user_id,
        }
    except jwt.ExpiredSignatureError:
        try:
            payload = jwt.decode(jwt=refresh_token,key=SECRET_KEY,algorithms=[str(ALGORITHM)])
            if payload.get("type") != "refresh_token":
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
        except InvalidTokenError:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Token")
        new_token = await create_access_token(
        data={
            "sub" : payload.get("sub"),
            "id": payload.get("id"),
            "role" : payload.get("role")
        })
        response.set_cookie(
            key="access_token",
            value=new_token,
            max_age= 60 * 60 * 24 * 7,
            httponly=True,
            secure=True,
            samesite="lax"
        )
    except InvalidTokenError:
        raise credential_exception
    except jwt.PyJWTError:
        raise credential_exception
