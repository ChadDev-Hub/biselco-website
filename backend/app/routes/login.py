from fastapi import APIRouter, Form, Depends, HTTPException, status, Response, Request
from fastapi.exceptions import ResponseValidationError
from fastapi import Response
from sqlalchemy import select
from sqlalchemy.ext.asyncio.session import AsyncSession
from ..dependencies.db_session import get_session
from ..models import Users
from ..schema.form import LoginUser, TokenData
from datetime import timedelta, datetime, timezone
import jwt
from jwt.exceptions import InvalidTokenError
from fastapi.security import OAuth2PasswordRequestForm
from ..utils.authentication import authenticate_user
router = APIRouter(prefix="/auth", tags=['Auth'])
from ..utils.token import create_access_token, create_refresh_token, ALGORITHM, SECRET_KEY
from dotenv import load_dotenv
import os
session_depends= Depends(get_session)
@router.post("/token", response_model=TokenData)
async def login_for_access_token(
                                response: Response,
                                form_data:OAuth2PasswordRequestForm = Depends(),
                                session:AsyncSession = session_depends,
                                 ):

        user = await authenticate_user(username=form_data.username, password=form_data.password, session=session)
        if not user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Username or Password")
    
        role = [role.name for role in user.roles]
        if not role:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User Invalid Role")
        access_token = await create_access_token(
            data={
                "sub" :user.user_name, 
                "id": user.id,
                "role": role[0]})
        refresh_token = await create_refresh_token(
            data= {
                "sub": user.user_name,
                "id": user.id,
                "role" : role[0]
            }
        )
        response.set_cookie(key="refresh_token",
                            value=refresh_token,
                            expires=datetime.now(timezone.utc)+ timedelta(days=7),
                            httponly=True,
                            secure=True
                            )
        response.set_cookie(
             key="access_token",
             value=access_token,
             max_age=60*15,
             httponly=True,
             samesite="none",
             secure=False,
             path="/"
        )

        return {
            "access_token": access_token,
            "token_type": "bearer"  
        }

        
@router.post("/token/refresh")
async def refresh_token(request:Request):
    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail= "Missing Token")
    try:
        payload = jwt.decode(jwt=refresh_token,key=SECRET_KEY,algorithms=[str(ALGORITHM)])
        if payload.get("type") != "refresh_token":
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    except InvalidTokenError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Token")
    new_token =await create_access_token(
        data={
            "sub" : payload.get("sub"),
            "id": payload.get("id"),
            "role" : payload.get("role")
        }
    )
    return {
        "access_token" : new_token,
        "token_type": "bearer"
    }