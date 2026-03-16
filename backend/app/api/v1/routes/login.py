from fastapi import (
    APIRouter,
    Form,
    Depends,
    HTTPException,
    status,
    Response,
    Request,
    Body,
    Query,
)
from fastapi.responses import RedirectResponse
from fastapi.exceptions import ResponseValidationError
from fastapi import Response
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio.session import AsyncSession
from ....dependencies.db_session import get_session
from ....modules.user import Users, Roles
from sqlalchemy.exc import IntegrityError
from ....modules.user.schema.requests_model import LoginUser
from datetime import timedelta, datetime, timezone
from jwt.exceptions import InvalidTokenError
from fastapi.security import OAuth2PasswordRequestForm
from ....core.authentication import authenticate_user
from ....modules.user.schema.response_model import UserModel
from dotenv import load_dotenv
from sqlalchemy.orm import selectinload
from ....core.security import (
    verify_google_login,
    get_google_token,
    verify_token,
    get_current_user,
    create_access_token,
    create_refresh_token,
    ALGORITHM,
    SECRET_KEY,
)
from ....modules.user.schema.requests_model import GoogleLogin
from ....modules.user.schema.requests_model import RefreshToken, AccessToken
from ....modules.user.schema.response_model import Token
from urllib.parse import urlencode
from typing import Optional
import os
from ....modules.user.service.add_user import add_user


router = APIRouter(prefix="/auth", tags=["Auth"])
load_dotenv()

ADMINLOGINSECRETKEY = os.getenv("ADMINLOGINSECRET")
GOOGLE_CLIENT = os.getenv("GOOGLE_CLIENT_ID")
CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
REDIRECT_URI = os.getenv("REDIRECT_URI")
GOOGLE_ENDPOINT = os.getenv("GOOGLE_AUTH_ENDPOINT")
FRONTEND = os.getenv("FRONTEND_BASE_URL")


@router.post("/token", status_code=status.HTTP_202_ACCEPTED)
async def login_for_access_token(
    response: Response,
    form_data: OAuth2PasswordRequestForm = Depends(),
    session: AsyncSession = Depends(get_session),
):
    user = await authenticate_user(
        username=form_data.username, password=form_data.password, session=session
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Username or Password",
        )

    role = [role.name for role in user.roles]
    if not role:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="User Invalid Role"
        )
    access_token = await create_access_token(
        data=Token(
            sub="access_token",
            email=user.email,
            user_id=str(user.id),
            role=[r.name for r in user.roles],
        )
    )
    refresh_token = await create_refresh_token(
        data=Token(
            sub="refresh_token",
            email=user.email,
            user_id=str(user.id),
            role=[r.name for r in user.roles],
        )
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        expires=datetime.now(timezone.utc) + timedelta(days=7),
        httponly=True,
        secure=False,
        samesite="lax",
    )
    response.set_cookie(
        key="access_token",
        value=access_token,
        max_age=60,
        httponly=True,
        secure=False,
        samesite="lax",
    )

    return {
        "detail": "Login Success",
    }


@router.post(
    "/token/refresh", status_code=status.HTTP_202_ACCEPTED, response_model=AccessToken
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


@router.get("/user/me", status_code=status.HTTP_200_OK, response_model=UserModel)
async def get_user(user: UserModel = Depends(get_current_user)):
    return user


# GOOGLE LOGIN

@router.get("/google/login")
async def google_login(secret: Optional[str] = Query(None)):
    role = "mco"
    if secret:
        if secret == ADMINLOGINSECRETKEY:
            role = "admin"
        else:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Invalid Secret Key",
            )

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
        value=refresh_token,
        expires=datetime.now(timezone.utc) + timedelta(days=7),
        httponly=True,
        secure=False,
        samesite="lax",
    )

    redirect.set_cookie(
        key="access_token",
        value=access_token,
        expires=datetime.now(timezone.utc) + timedelta(minutes=15),
        httponly=True,
        secure=False,
        samesite="lax",
    )
    return redirect
