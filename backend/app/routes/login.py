from fastapi import APIRouter, Form, Depends, HTTPException, status, Response, Request
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
session_depends= Depends(get_session)


@router.post("/token", response_model=TokenData)
async def login_for_access_token(
                                response: Response,
                                form_data:OAuth2PasswordRequestForm = Depends(),
                                session:AsyncSession = session_depends,
                                 ):
    
    try:
        user = await authenticate_user(username=form_data.username, password=form_data.password, session=session)
        if not user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Username or Password")
        role = [role.name for role in user.roles][0]
        access_token = await create_access_token(
            data={
                "sub" :user.user_name, 
                "id": user.id,
                "role": role})
        refresh_token = await create_refresh_token(
            data= {
                "sub": user.user_name,
                "id": user.id,
                "role" : role
            }
        )
        print(role)
        response.set_cookie(key="refresh_token",
                            value=refresh_token,
                            expires=datetime.now(timezone.utc)+ timedelta(days=7),
                            httponly=False,
                            secure=False
                            )
        return {
            "access_token": access_token,
            "token_type": "bearer"
        }
    except Exception as e:
        print(e)
        raise HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail="Login failed"
    )
        
@router.post("/token/refresh")
async def refresh_token(request:Request):
    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail= "Invalid Token")
    try:
        payload = jwt.decode(jwt=refresh_token,key=SECRET_KEY,algorithms=ALGORITHM)
        if payload.get("type") != "refresh_token":
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    except InvalidTokenError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Token")
    new_token =await create_access_token(
        data={
            "sub" : payload.get("sub"),
            "id": payload.get("id")
        }
    )
    return {
        "access_token" : new_token,
        "token_type": "bearer"
    }