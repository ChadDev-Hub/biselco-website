from fastapi import (
    APIRouter,
    Form,
    Depends,
    HTTPException,
    status,
    Response,
    Request,
    Query,
)
from fastapi.responses import RedirectResponse
from fastapi.exceptions import ResponseValidationError
from fastapi import Response
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio.session import AsyncSession
from ....dependencies.db_session import get_session
from ...user import Users, Roles
from sqlalchemy.exc import IntegrityError
from ...user.schema.requests_model import LoginUser
from datetime import timedelta, datetime, timezone
from jwt.exceptions import InvalidTokenError
from fastapi.security import OAuth2PasswordRequestForm
from ....core.authentication import authenticate_user
from ...user.schema.response_model import UserModel
from dotenv import load_dotenv
from sqlalchemy.orm import selectinload
from ....core.security import (
    verify_google_login,
    get_google_token,
    verify_token,
    get_current_user,
    create_access_token,
    create_refresh_token,
)

from ...user.schema.requests_model import RefreshToken, AccessToken
from ...user.schema.response_model import Token
from urllib.parse import urlencode
from typing import Optional
import os
from ...user.service.add_user import add_user
from ...user.schema.requests_model import SignUpUser
from ..services.get import GetServices
from hashlib import sha256
from authlib.integrations.httpx_client import AsyncOAuth2Client


import secrets
router = APIRouter(prefix="/auth", tags=["Auth"])
load_dotenv()

ADMINLOGINSECRETKEY = os.getenv("ADMINLOGINSECRET")
GOOGLE_CLIENT = os.getenv("GOOGLE_CLIENT_ID")
CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
REDIRECT_URI = os.getenv("REDIRECT_URI")
GOOGLE_ENDPOINT = os.getenv("GOOGLE_AUTH_ENDPOINT")
FRONTEND = os.getenv("FRONTEND_BASE_URL")
BASESERVERURL=os.getenv("BASESERVERURL")
REFRESH_TOKEN_EXPIRE=os.getenv("REFRESH_TOKEN_EXPIRE")
ACCESS_TOKEN_EXPIRE=os.getenv("ACCESS_TOKEN_EXPIRE")




@router.get("/token/refresh_access_token", status_code=status.HTTP_200_OK)
async def refresh_access_token(
    get_services:GetServices = Depends(GetServices)
):  
    return await get_services.refresh_access_token()

@router.post(
    "/token/refresh", status_code=status.HTTP_202_ACCEPTED
)
async def refresh_token(
    token: RefreshToken,
    session: AsyncSession = Depends(get_session)
):
    refresh_token = token.refresh_token
    if not refresh_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized Transaction"
        )
    try:
        verified_refresh_token = await verify_token(refresh_token)
        if not verified_refresh_token:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Unauthorized Transaction",
            )
        current_user = (await session.execute(select(Users)
                                              .where(Users.id == verified_refresh_token.user_id)
                                              .options(selectinload(Users.roles)))).scalar_one_or_none()
        if not current_user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Unauthorized Transaction",
            )
        access_token = await create_access_token(
            data=Token(
                sub="access_token",
                email=current_user.email,
                user_id=str(current_user.id),
                role=[r.name for r in current_user.roles],
            ))
    except InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Invalid Token"
        )
    return AccessToken(access_token=access_token, type="Bearer")


# GET CURRENT USER
@router.get("/user/me", status_code=status.HTTP_200_OK, response_model=UserModel)
async def get_user(user: UserModel = Depends(get_current_user)):
    return user


# GOOGLE LOGIN VALIDATION
@router.post("/google/validate", status_code=status.HTTP_200_OK)
async def validate_role(secret: Optional[str] = Query(None)):
    role = "mco"
    if secret: 
        if secret != ADMINLOGINSECRETKEY:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Invalid Secret Key",
            )    
        else:
            role = "admin"
    queryParams = {
        "role": role
    }
    url = f"{BASESERVERURL}/v1/auth/google/login?{urlencode(queryParams)}"
    return {
        "url": url
    }

# GOOGLE LOGIN ROUTES
@router.get("/google/login")
async def google_login(role: Optional[str] = Query(None)):
    queryparms = {
        "client_id": GOOGLE_CLIENT,
        "redirect_uri": REDIRECT_URI,
        "response_type": "code",
        "scope": "openid email profile",
        "access_type": "offline",
        "prompt": "consent",
        "state": role
    }

    url = f"{GOOGLE_ENDPOINT}?{urlencode(queryparms)}"
    return RedirectResponse(url=url)


# GOOGLE LOGIN SUCCESSULL CALLBACK

@router.get("/google/login/callback")
async def google_login_callback(
    code: Optional[str] = Query(None),
    state: Optional[str] = Query(None),
    session: AsyncSession = Depends(get_session),
    error: Optional[str] = Query(None),
):
    if error: 
        return RedirectResponse(url=f"{FRONTEND}/landing")
    if not code:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid Google Credentials"
        )
    role = state
    token = await get_google_token(code)
   
    id_token = token.get("id_token")
    
    if not token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid Token"
        )
    user = await verify_google_login(id_token)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid User"
        )
    if not role:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid Role"
        )
    # Current User
    current_user = await add_user(session=session, role=role, user=user)
    access_token = await create_access_token(
        data=Token(
            sub="access_token",
            user_id=str(current_user.id),
            email=current_user.email,
            role=[r.name for r in current_user.roles],
        )
    )
    refresh_token = await create_refresh_token(
        data=Token(
            sub="refresh_token",
            user_id=str(current_user.id),
            email=current_user.email,
            role=[r.name for r in current_user.roles],
        )
    )

    redirect = RedirectResponse(url=f"{FRONTEND}/")
    redirect.set_cookie(
        key="refresh_token",
        path="/",
        value=refresh_token,
        expires=datetime.now(timezone.utc) + timedelta(days=float(REFRESH_TOKEN_EXPIRE)),
        httponly=True,
        secure=True,
        samesite="lax",
    )

    redirect.set_cookie(
        key="access_token",
        path="/",
        value=access_token,
        expires=datetime.now(timezone.utc) + timedelta(minutes=float(ACCESS_TOKEN_EXPIRE)),
        httponly=True,
        secure=True,
        samesite="lax",
    )
    return redirect


# LOGOUT

@router.post("/logout", status_code=status.HTTP_202_ACCEPTED)
async def logout(response:Response):
    response.delete_cookie(
        "refresh_token",
        path="/",
        httponly=True,
        samesite="lax",
        )
    response.delete_cookie(
        "access_token",
        path="/",
        httponly=True,
        samesite="lax"
        )
    return {
        "success": True
    }
    

# FACEBOOK AUTHENTICATION


FACEBOOK_ID = os.getenv("FACEBOOKAPP_ID")
FACEBOOK_SECRET = os.getenv("FACEBOOKAPP_SECRET")
FACEBOOK_ENDPOINT = os.getenv("FACEBOOK_AUTH_ENDPOINT")
FACEBOOK_TOKEN_ENDPOINT = os.getenv("FACEBOOK_TOKEN_ENDPOINT")
FACEBOOK_ME=os.getenv("FACEBOOK_ME")
SCOPE = ["email","public_profile"]

facebook_outh = AsyncOAuth2Client(
        client_id=FACEBOOK_ID,
        client_secret=FACEBOOK_SECRET,
        scope=SCOPE)
@router.get("/facebook/login", status_code=status.HTTP_200_OK)
async def facebook_login(request: Request):
    url = request.url_for("facebook")
    return {
        "url" : str(url)
    }

@router.get("/facebook", status_code=status.HTTP_200_OK)
async def facebook(request: Request):
    try:
        state = secrets.token_urlsafe(32)
        redirect_uri=request.url_for("facebook_callback")
        facebook_outh.redirect_uri = str(redirect_uri)
        uri, state = facebook_outh.create_authorization_url(FACEBOOK_ENDPOINT, state=state)
        redirect = RedirectResponse(url=uri)
        return redirect
    except Exception as e:
        print(e)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get("/facebook/callback", status_code=status.HTTP_200_OK)
async def facebook_callback(request: Request, session: AsyncSession = Depends(get_session)):
    try:
        params = request.query_params
        provider = "facebook"
        if params.get("error"):
            redirect = RedirectResponse(url=FRONTEND)
            return redirect
        
        redirect_uri = request.url_for("facebook_callback")
        facebook_outh.redirect_uri = str(redirect_uri)
        code = request.query_params.get("code")
        
        token = await facebook_outh.fetch_token(FACEBOOK_TOKEN_ENDPOINT, code=code, redirect_uri=str(redirect_uri))
        
        data = await facebook_outh.get(
            FACEBOOK_ME,
            params={
                "fields": "id,name,email,first_name,last_name,picture.width(200).height(200)",
                "access_token": token["access_token"],
            },
        )
        res = data.json()
        user = SignUpUser(
            email=res.get("email"),
            first_name=res.get("first_name"),
            last_name=res.get("last_name"),
            user_name=res.get("name"),
            provider_id=res.get("id"),
            photo=res.get("picture").get("data").get("url"),
            provider_token=token["access_token"],
            hash=sha256(f"{res.get('id')}|{provider}".encode("utf-8")).hexdigest(),
            provider=provider,
        )
        if not user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid User"
            )
        current_user = await add_user(session=session, role="mco", user=user)
        
        if not current_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid User"
            )
        
        access_token = await create_access_token(
            data=Token(
                sub="access_token",
                user_id=str(current_user.id),
                email=current_user.email,
                role=[r.name for r in current_user.roles],
            )
        )
        refresh_token = await create_refresh_token(
            data=Token(
                sub="refresh_token",
                user_id=str(current_user.id),
                email=current_user.email,
                role=[r.name for r in current_user.roles],
            )
        )
        
        redirect = RedirectResponse(url=FRONTEND)
        redirect.set_cookie(
            key="refresh_token",
            path="/",
            value=refresh_token,
            expires=datetime.now(timezone.utc) + timedelta(days=float(REFRESH_TOKEN_EXPIRE)),
            httponly=True,            
            secure=True,
            samesite="lax",
        )
        redirect.set_cookie(
            key="access_token",
            path="/",
            value=access_token,
            expires=datetime.now(timezone.utc) + timedelta(minutes=float(ACCESS_TOKEN_EXPIRE)),
            httponly=True,
            secure=True,
            samesite="lax",
        )
        return redirect
        
    except Exception as e:
        print(e)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))