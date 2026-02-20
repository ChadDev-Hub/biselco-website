from fastapi import APIRouter, Form, Depends, HTTPException, status, Response, Request, Body
from fastapi.exceptions import ResponseValidationError
from fastapi import Response
from sqlalchemy import select
from sqlalchemy.ext.asyncio.session import AsyncSession
from ....dependencies.db_session import get_session
from ....modules.user import Users, Roles
from ....modules.user.schema.requests_model import LoginUser
from datetime import timedelta, datetime, timezone
import jwt
from jwt.exceptions import InvalidTokenError
from fastapi.security import OAuth2PasswordRequestForm
from ....core.authentication import authenticate_user
from ....modules.user.schema.response_model import UserModel
from ....core.security import create_access_token, create_refresh_token, ALGORITHM, SECRET_KEY
from ....core.security import get_current_user
from dotenv import load_dotenv
from sqlalchemy.orm import selectinload
from ....core.security import verify_google_login
from ....core.security import verify_token
from ....modules.user.schema.requests_model import GoogleLogin
from ....modules.user.schema.requests_model import RefreshToken, AccessToken
import os


router = APIRouter(prefix="/auth", tags=['Auth'])
load_dotenv()


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
                "sub": "access_token",
                "email" : user.email, 
                "user_id": str(user.id),
                "role": role})
        refresh_token = await create_refresh_token(
            data= {
                "sub": "refresh_token",
                "email": user.email,
                "user_id": str(user.id),
                "role" : role
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
            max_age=60,
            httponly=True,
            secure=False,
            samesite="lax")
        
        return {
             "detail": "Login Success",
        }
        
@router.post("/token/refresh", status_code=status.HTTP_202_ACCEPTED, response_model=AccessToken)
async def refresh_token(token:RefreshToken, session:AsyncSession = Depends(get_session)):
    refresh_token = token.refresh_token
    if not refresh_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized Transaction")
    try:
        current_user = await verify_token(refresh_token)
        if not current_user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized Transaction")
        access_token_data = {
            "sub": "access_token",
            "email": current_user.get("email"),
            "user_id": current_user.get("user_id"),
            "role": current_user.get("role")
        }
        access_token = await create_access_token(data=access_token_data)
    except InvalidTokenError:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Invalid Token")
    return AccessToken(
        access_token=access_token,
        type="Bearer")


@router.get("/user/me", status_code=status.HTTP_200_OK, response_model=UserModel)
async def get_user(user:dict = Depends(get_current_user), session:AsyncSession = Depends(get_session)):
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User Not Found")
    user_stmt = (await session.execute(
        select(Users)
        .options(selectinload(Users.roles))
        .where(Users.id == user.get("user_id")))).scalar_one_or_none()
    if not user_stmt:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User Not Found")
    roles_name = [role.name for role in user_stmt.roles]
    return UserModel(
        user_id=user_stmt.id,
        user_name=user_stmt.user_name,
        email=user_stmt.email,
        first_name=user_stmt.first_name,
        last_name=user_stmt.last_name,
        role=roles_name,
        photo=user_stmt.photo
    )
    

# GOOGLE LOGIN
@router.post("/google")
async def google_login(response:Response,data:GoogleLogin, session:AsyncSession = Depends(get_session)):
    token = data.token
    if not token:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Token Not Found")
    
    verified_token = await verify_google_login(token)
    if not verified_token:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid Token")
    
    # GET USER ROLE
    mco_user  = (await session.execute(
        select(Roles).where(Roles.name == "mco"))).scalar_one_or_none()
    if not mco_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Role Not Found")
    
    
    # Check If USER EXISTS IN THE DATABSE
    user = (await session.execute(select(Users).where(Users.email == verified_token.get("email"))
                                       .options(selectinload(Users.roles)))).scalar_one_or_none()
    # IF USER DOES NOT EXISTS CREATE USER
    if not user:
        user = Users(
            user_name=verified_token.get("username"),
            first_name=verified_token.get("first_name"),
            last_name=verified_token.get("last_name"),
            email=verified_token.get("email"),
            photo=verified_token.get("picture"),
            roles= [mco_user]
        )
        session.add(user)
        await session.commit()
        await session.refresh(user, attribute_names=["roles"])
        
    # IF USER EXISTS GET USER INFORMATION TO ENCODE TOKEN
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User Not Found")
    roles = [role.name for role in user.roles]
    access_token_data = {
        "sub": "access_token",
        "email" : user.email,
        "user_id": str(user.id),
        "role": roles}
    
    refresh_token_data = {
        "sub": "refresh_token",
        "email" : user.email,
        "user_id": str(user.id),
        "role": roles
    }
        
    access_token = await create_access_token(data=access_token_data)
    refresh_token = await create_refresh_token(data=refresh_token_data)
    
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
            max_age=60,
            httponly=True,
            secure=False,
            samesite="lax")
    return {
        "detail": "Login Success"
    }