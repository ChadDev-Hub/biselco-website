from datetime import datetime, timedelta, timezone
from fastapi import Depends, HTTPException, status, WebSocket
from fastapi.security import OAuth2PasswordBearer
import jwt
import os
from dotenv import load_dotenv
from google.oauth2 import id_token
from google.auth.transport import requests
from ..modules.user.schema.response_model import Token
from sqlalchemy import select
from ..dependencies.db_session import get_session
from sqlalchemy.ext.asyncio.session import AsyncSession
from ..modules.user import Users
from ..modules.user.schema.response_model import UserModel
from sqlalchemy.orm import selectinload
import httpx
from ..modules.user.schema.response_model import GoogleUser

load_dotenv()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/v1/auth/token")
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = 15
REFRESH_TOKEN_EXPIRE_DAYS = 7
G_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
G_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
REDIRECT_URI = os.getenv("REDIRECT_URI")


# CREATE ACCESS TOKEN
async def create_access_token(data: Token):
    if not SECRET_KEY:
        raise ValueError("No secret key")
    to_encode = data.model_dump()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire, "type": "access_token"})
    encoded_jwt = jwt.encode(payload=to_encode, key=SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


# CREATE REFRESH TOKEN
async def create_refresh_token(data:Token):
    if not SECRET_KEY:
        raise ValueError("No secret key")
    to_encode = data.model_dump()
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
        return Token(
            sub=sub, email=email, user_id=user_id, role=role
        )
    except jwt.ExpiredSignatureError:
        raise
    except jwt.PyJWTError:
        return None


# GET CURRENT USER
async def get_current_user(
    token: str = Depends(oauth2_scheme), session: AsyncSession = Depends(get_session)
):
    if not SECRET_KEY:
        raise ValueError("No secret key")
    credential_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid Credential",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if not token:
        raise credential_exception
    try:
        payload = await verify_token(token)
        if not payload:
            raise credential_exception
        if payload.sub != "access_token":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, detail="Invalid Token"
            )
        user_id = payload.user_id
        user = (
            await session.execute(
                select(Users)
                .options(selectinload(Users.roles))
                .where(Users.id == user_id)
            )
        ).scalar_one_or_none()
        if not user:
            raise credential_exception
        return UserModel.model_validate(user)
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Access token expired")


# WEBSOCKET VERIFY CURRENT USER
async def get_current_user_ws(websocket: WebSocket):
    if not SECRET_KEY:
        raise ValueError("No secret key")
    token = websocket.cookies.get("refresh_token")
    if not token:
        return None
    try:
        paload = await verify_token(token)
        if not paload:
            return None
        return Token(**paload.model_dump())
    except jwt.PyJWTError:
        return None


async def get_google_token(code: str):
    async with httpx.AsyncClient() as client:
        token_res = await client.post(
            "https://oauth2.googleapis.com/token",
            data={
                "code": code,
                "client_id": G_CLIENT_ID,
                "client_secret": G_SECRET,
                "redirect_uri": REDIRECT_URI,
                "grant_type": "authorization_code",
            },
        )
        return token_res.json()


# VERIFY GOOGLE LOGIN
async def verify_google_login(token: str):
    if not token:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Token Not Found"
        )
    idinfo = id_token.verify_oauth2_token(token, requests.Request(), G_CLIENT_ID)
    return GoogleUser(
        user_name=idinfo["sub"],
        email=idinfo["email"],
        first_name=idinfo["given_name"],
        last_name=idinfo["family_name"],
        photo=idinfo["picture"],
    )
