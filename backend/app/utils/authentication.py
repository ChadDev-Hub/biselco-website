from ..models import Users
from sqlalchemy.ext.asyncio.session import AsyncSession
from sqlalchemy.orm import selectinload
from .hashing import verify_password
from sqlalchemy import select



async def authenticate_user(username:str, password:str , session:AsyncSession):
    query = await session.execute(select(Users).options(selectinload(Users.roles, Users.meters, Users.complaints)).where(Users.user_name == username)) 
    result = query.scalar_one_or_none()
    if not result:
        return False
    if not verify_password(password,result.password):
        return False
    return result