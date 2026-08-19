from ..model.conductor_wires import ConductorWires
from sqlalchemy import select
from fastapi import HTTPException, status, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from .....dependencies.db_session import get_session


class GetConductorWires:
    def __init__(self, session:AsyncSession = Depends(get_session)):
        self.session= session
    async def get_conductor_name(self):
        stmt = select(ConductorWires.id, ConductorWires.name)
        data = (await self.session.execute(stmt)).mappings().all()
        return data
        