from sqlalchemy.ext.asyncio import AsyncSession
from ..model.complaints_history import ComplaintsStatusHistory
from sqlalchemy import insert

async def add_complaints_history(session: AsyncSession, data: dict):
    stmt = insert(ComplaintsStatusHistory).values(data)
    await session.execute(stmt)
    await session.commit()