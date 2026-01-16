from typing import Annotated
from fastapi import APIRouter, Depends, Form, status
from fastapi.exceptions import HTTPException
from fastapi.responses import RedirectResponse
from ..models import Users, MeterAccount
from ..schema.form import SignUpUser
from ..dependencies.db_session import get_session
from sqlalchemy.ext.asyncio.session import AsyncSession
from sqlalchemy import select, and_
from ..utils.hashing import hash_password
router = APIRouter(prefix="/auth", tags=['Auth'])

session_depends = Depends(get_session)


@router.post("/signup")
async def signupuser(data:SignUpUser=Form(), db:AsyncSession = session_depends):
    '''
    This function represent the Signup route and store user information in a database.
    
    :param data: Signup Form Data that uses Pydanctic Model
    attributed data:
        - name: Username for Signingup
        - email: User email for Signingup
        - password: User Password
    
    '''
    results = await db.execute(select(Users).where(Users.email == data.email))
    existing_user = results.mappings().first()
    
    if existing_user:
        raise HTTPException(status.HTTP_403_FORBIDDEN, detail="Email Already Registered")
    try: 
        user = Users(
            user_name=data.username,
            first_name = data.firstname,
            last_name = data.lastname,
            email=data.email,
            password=hash_password(data.password),

        )
        db.add(user)
        await db.commit()
        await db.close()
        return  {
            "detail": "Signup Sucessfull"
        }
    except Exception as e:
        print(e)
        

@router.post("/admin/signup")
async def signadmin(data:SignUpUser=Form(), db:AsyncSession = session_depends):
    '''
    This function represent the Signup route and store user information in a database
    For Admin User
    
    :param data: Signup Form Data that uses Pydanctic Model
    attributed data:
        - name: Username for Signingup
        - email: User email for Signingup
        - password: User Password
    
    '''
    results = await db.execute(select(Users).where(Users.email == data.email))
    existing_user = results.mappings().first()
    
    if existing_user:
        return HTTPException(status.HTTP_403_FORBIDDEN, detail="Email Already Registered")
    user = Users(
        user_name=data.username,
        first_name = data.firstname,
        last_name = data.lastname,
        email=data.email,
        password=data.password,
        is_admin=True
    )
    
    db.add(user)
    await db.commit()
    await db.close()
    return  {
        "signup_status": "Signup Sucessfull"
    }