from fastapi import HTTPException, APIRouter, status, Depends, Query, Cookie
from fastapi.responses import RedirectResponse
from ...user.schema.response_model import Token
from urllib.parse import urlencode
from dotenv import load_dotenv
from sqlalchemy.ext.asyncio.session import AsyncSession
from ....dependencies.db_session import get_session
import os
from typing import Optional
from ....core.security import verify_google_login, get_biscollect_google_token
from ....core.security import create_access_token, create_refresh_token
from ...user.service.add_user import add_user
from datetime import datetime, timedelta, timezone
from ..services.get import GetServices

load_dotenv()
BISCOLLECT_SECRET_KEY = os.getenv("BISCOLLECT_SECRET_KEY")
BASESERVERURL = os.getenv("BASESERVERURL")
GOOGLE_CLIENT = os.getenv("GOOGLE_CLIENT_ID")
CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
REDIRECT_URI = os.getenv("BISCOLLECT_REDIRECT_URI")
GOOGLE_ENDPOINT = os.getenv("GOOGLE_AUTH_ENDPOINT")
BISCOLLECT_URL = os.getenv("BISCOLLECT_BASE_URL")
ACCESS_TOKEN_EXPIRE = os.getenv("ACCESS_TOKEN_EXPIRE")
REFRESH_TOKEN_EXPIRE = os.getenv("REFRESH_TOKEN_EXPIRE")
router = APIRouter(
    prefix="/biscollect",
    tags=["biscollect"],
)


@router.get("/refresh/token", status_code=status.HTTP_200_OK)
async def refresh_token(get_services:GetServices = Depends(GetServices)): 
    
    return await get_services.refresh_access_token()


@router.post("/validate", status_code=status.HTTP_200_OK)
async def validate_login(secret=Query(...)):
    print("validating login")
    if not secret:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Secret Key is Required",
        )
    if secret != BISCOLLECT_SECRET_KEY:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Invalid Secret Key",
        )
    queryParams = {
        "role": "admin"
    }
    url = f"{BASESERVERURL}/v1/biscollect/google/login?{urlencode(queryParams)}"
    return {
        "url": url
    }



@router.get("/google/login")
async def google_login(role=Query(...)):
    print("login to google endpoint")
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

@router.get("/google/login/callback")
async def biscollect_google_login_callback(
    code: Optional[str] = Query(None),
    state: Optional[str] = Query(None),
    session: AsyncSession = Depends(get_session),
    error: Optional[str] = Query(None),
):
    if error:
        return RedirectResponse(url=f"{BISCOLLECT_URL}/menu")
    if not code:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid Google Credentials"
        )
    role = state
    token = await get_biscollect_google_token(code)
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
    current_user = await add_user(user=user, role=role, session=session)
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid User"
        )
        
    print("loggin in callback")
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
    redirect = RedirectResponse(url=f"{BISCOLLECT_URL}/menu")
    redirect.set_cookie(
        key="refresh_token",
        path="/",
        value=refresh_token,
        expires=datetime.now(timezone.utc) + timedelta(days=float(REFRESH_TOKEN_EXPIRE)),
        httponly=True, 
        secure=True
    )
    

    redirect.set_cookie(
        key="access_token",
        path="/",
        value=access_token,
        expires=datetime.now(timezone.utc) + timedelta(minutes=float(ACCESS_TOKEN_EXPIRE)),
        httponly=True, 
        secure=True)
    return redirect