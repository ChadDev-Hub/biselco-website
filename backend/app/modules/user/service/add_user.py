from sqlalchemy import select
from sqlalchemy.dialects.postgresql import insert
from fastapi import HTTPException, status
from ..model.users import Users
from ..model.roles import Roles
from sqlalchemy.ext.asyncio import AsyncSession
from ..schema.response_model import UserModel
from ..schema.requests_model import SignUpUser
from sqlalchemy.orm import selectinload
from datetime import datetime

async def add_user(session: AsyncSession, role:str, user:SignUpUser):
    roles = (await session.execute(select(Roles).where(Roles.name == role))).scalar_one_or_none()
    if not roles:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Role Not Found")
       
        # CHECK AND UPDATE EXISTING USER
    existing_user = (await session.execute(select(Users)
                                        .options(selectinload(Users.roles))
                                        .where(Users.hash == user.hash))).scalar_one_or_none()
    if existing_user:
        setattr(existing_user, "email", user.email)
        setattr(existing_user, "first_name", user.first_name)
        setattr(existing_user, "last_name", user.last_name)
        setattr(existing_user, "photo", user.photo)
        setattr(existing_user, "provider",user.provider)
        setattr(existing_user, "provider_id",user.provider_id)
        setattr(existing_user, "provider_token",user.provider_token)
        setattr(existing_user, "user_name",user.user_name)
        await session.commit()
        await session.refresh(existing_user, attribute_names=["roles"])
        
    
    
    if not existing_user:
        # ADD USER
        new_user = Users(**user.model_dump())
        new_user.login_at = datetime.now()
        new_user.roles.append(roles)
        session.add(new_user)
        await session.commit()
        await session.refresh(new_user, attribute_names=["roles"])
        return new_user
    
    if roles not in existing_user.roles:
        existing_user.roles.append(roles)
        await session.commit()
        await session.refresh(existing_user, attribute_names=["roles"])
    return existing_user
    
    
    