from sqlalchemy.ext.asyncio import AsyncSession
from ....dependencies.db_session import get_session
from ..model.complaints_message import ComplaintsMessage
from sqlalchemy import insert





async def add_complaints_message(session: AsyncSession, data: dict):
    stmt = (
        insert(ComplaintsMessage)
        .values(**data)
        .returning(ComplaintsMessage))
    result = await session.execute(stmt)
    await session.commit()
 
    new_data = result.scalar_one()
    return new_data