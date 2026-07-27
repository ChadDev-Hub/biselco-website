from sqlalchemy import select
from sqlalchemy.orm import selectinload
from ..model.users import Users
from ..model.roles import Roles
from sqlalchemy.ext.asyncio import AsyncSession
from ....dependencies.db_session import get_session
from fastapi import Depends, HTTPException, status, Cookie
from typing import Optional
from ..schema.response_model import UserModel
from ....core.security import verify_token, create_access_token, create_refresh_token


class GetUserServices:
    def __init__(self, session:AsyncSession = Depends(get_session)):
        self.session = session
    async def get_users_by_roles(self, roles:str):
        data =  (await self.session.execute(select(Users).where(Users.roles.any(Roles.name == roles)))).scalars().all()
        return [str(i.id) for i in data ]
    
    async def get_current_user(self, access_token:Optional[str] = Cookie(None)):
        credential_exception = HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid Credential",
            )
        if not access_token:
            raise credential_exception
        
        try:
            payload = await verify_token(access_token)
            
            
            if not payload:
                raise credential_exception
            if payload.sub != "access_token":
                print("invalid token")
                raise credential_exception
            
            user = (await self.session.execute(
                select(Users)
                .options(selectinload(Users.roles))
            )).scalar_one_or_none()
            if not user:
                raise credential_exception
            return UserModel.model_validate(user)
        except Exception as e: 
            print(e)
            raise credential_exception
    
            
            
        