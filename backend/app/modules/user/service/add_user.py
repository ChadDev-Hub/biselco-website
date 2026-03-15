from sqlalchemy import select
from fastapi import HTTPException, status
from ..model.users import Users
from ..model.roles import Roles
from sqlalchemy.ext.asyncio import AsyncSession
from ..schema.response_model import UserModel
from sqlalchemy.orm import selectinload


async def add_user(session: AsyncSession, role:str, user:UserModel):
    roles = (await session.execute(select(Roles).where(Roles.name == role))).scalar_one_or_none()
    if not roles:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Role Not Found")
    # CHECK EXISTING USER
    existing_user = (await session.execute(select(Users)
                                           .options(selectinload(Users.roles))
                                           .where(Users.email == user.email))).scalar_one_or_none()
    if not existing_user:
        # ADD USER
        new_user = Users(**user.model_dump())
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
    
    
    