from sqlalchemy import select
from sqlalchemy.orm import selectinload
from ..model.users import Users
from ..model.roles import Roles
from sqlalchemy.ext.asyncio import AsyncSession
from ....dependencies.db_session import get_session
from fastapi import Depends, HTTPException, status, Cookie
from typing import Optional
from ..schema.response_model import UserModel
from typing import Optional
from ....core.security import verify_token, create_access_token, create_refresh_token


class GetUserServices:
    def __init__(self, session:AsyncSession = Depends(get_session), access_token:Optional[str] = Cookie(None)):
        self.session = session
        self.access_token = access_token
        self.credential_exception = HTTPException(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        detail="Invalid Credential",
                    )
    async def get_users_by_roles(self, roles:str):
        data =  (await self.session.execute(select(Users).where(Users.roles.any(Roles.name == roles)))).scalars().all()
        return [str(i.id) for i in data ]
    
    
    async def check_user(self,user_id:str):
        user = (await self.session.execute(
                        select(Users)
                        .options(selectinload(Users.roles))
                        .where(Users.id == user_id)
                    )).scalar_one_or_none()
        if not user:
            raise self.credential_exception
        return user
        
    
    async def get_current_user(self):
        
        if not self.access_token:
            raise self.credential_exception
        
        try:
            payload = await verify_token(self.access_token)
            print("payload: ", payload)
            if not payload:
                raise self.credential_exception
            if payload.sub != "access_token":
                print("invalid token")
                raise self.credential_exception
            user = await self.check_user(payload.user_id)
            if not user:
                raise self.credential_exception
    
            return UserModel.model_validate(user)
        except Exception as e: 
            print(e)
            raise self.credential_exception
    
            
            
        