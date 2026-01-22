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


async def get_current_user(
        response:Response,
        requests:Request
):
    credential_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid Credential",
        headers={"WWW-Authenticate" : "Bearer"}
    )

    token = requests.cookies.get("access_token")
    refresh_token = requests.cookies.get("refresh_token")
    if not token:
        raise credential_exception

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_name = payload.get("sub")
        user_id = payload.get("id")
        role = payload.get("role")

        print(payload)
        return {
            "username": user_name,
            "userid": user_id,


        }
    
    except jwt.ExpiredSignatureError:
        if not refresh_token:
            raise credential_exception
        
        try:
            refresh_payload = jwt.decode(refresh_token,SECRET_KEY, algorithms=[ALGORITHM])
            user = refresh_payload.get("sub")
            user_id = refresh_payload.get("id")
            role = refresh_payload.get("role")
            new_token_data = {
                "sub": user,
                "id": user_id,
                "role": role
            }
            new_access = await create_access_token(new_token_data)
            response.set_cookie(
                key="access_token",
                max_age=900,
                value=new_access,
                httponly=True,
                secure=True,
                samesite="lax",
                path="/"
            )
            print(user)
            return user
        except InvalidTokenError:
            raise credential_exception
        except jwt.PyJWTError:
            raise credential_exception
