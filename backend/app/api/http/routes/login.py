from fastapi import APIRouter, Form, Depends, HTTPException, status, Response, Request, Body
from fastapi.exceptions import ResponseValidationError
from fastapi import Response
from sqlalchemy import select
from sqlalchemy.ext.asyncio.session import AsyncSession
from ....dependencies.db_session import get_session
from ....models import Users
from ....schema.form import LoginUser, TokenData
from datetime import timedelta, datetime, timezone
import jwt
from jwt.exceptions import InvalidTokenError
from fastapi.security import OAuth2PasswordRequestForm
from ....utils.authentication import authenticate_user
from ....schema.response_model import UserModel
from ....utils.token import create_access_token, create_refresh_token, ALGORITHM, SECRET_KEY
from ....utils.token import get_current_user
from dotenv import load_dotenv
from sqlalchemy.orm import selectinload
from ....utils.token import verify_google_login
import os


router = APIRouter(prefix="/auth", tags=['Auth'])


@router.post("/token", status_code=status.HTTP_202_ACCEPTED)
async def login_for_access_token(
                                response: Response,
                                form_data:OAuth2PasswordRequestForm = Depends(),
                                session:AsyncSession = Depends(get_session),
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
                            secure=False,
                            samesite="lax"
                            )
        response.set_cookie(
            key="access_token",
            value=access_token,
            expires=datetime.now(timezone.utc)+ timedelta(days=7),
            httponly=True,
            secure=False,
            samesite="lax")
        
        return {
             "detail": "Login Success",
        }

        
@router.post("/token/refresh", status_code=status.HTTP_100_CONTINUE)
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
@router.get("/user/me", status_code=status.HTTP_200_OK, response_model=UserModel)
async def get_user(user:dict = Depends(get_current_user), session:AsyncSession = Depends(get_session)):
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User Not Found")
    user_stmt = (await session.execute(
        select(Users)
        .options(selectinload(Users.roles))
        .where(Users.id == user.get("userid")))).scalar_one_or_none()
    if not user_stmt:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User Not Found")
 
    return UserModel(username=user_stmt.user_name, user_id=user_stmt.id, role=user_stmt.roles[0].name)\
    

# GOOGLE LOGIN
@router.post("/google")
async def google_login(data:dict=Body()):
    token =data.get("token")
    verified_token = await verify_google_login(token)
    return verified_token