from sqlalchemy import select
from ..model.users import Users
from ..model.roles import Roles
from sqlalchemy.ext.asyncio import AsyncSession


async def get_users_by_roles(session:AsyncSession, roles:str):
    data =  (await session.execute(select(Users).where(Users.roles.any(Roles.name == roles)))).scalars().all()
    return [str(i.id) for i in data ]