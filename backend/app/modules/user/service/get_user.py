from sqlalchemy import select
from ..model.users import Users
from ..model.roles import Roles
from sqlalchemy.ext.asyncio import AsyncSession
from ....dependencies.db_session import get_session
from fastapi import Depends


class GetUserServices:
    def __init__(self, session:AsyncSession = Depends(get_session)):
        self.session = session
    async def get_users_by_roles(self, roles:str):
        data =  (await self.session.execute(select(Users).where(Users.roles.any(Roles.name == roles)))).scalars().all()
        return [str(i.id) for i in data ]