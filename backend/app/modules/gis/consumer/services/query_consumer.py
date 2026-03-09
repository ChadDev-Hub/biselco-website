from sqlalchemy import select, or_
from sqlalchemy.ext.asyncio import AsyncSession
from ..model.consumer import ConsumerMeter
from .....dependencies.db_session import get_session
from typing import Optional, Any, List
async def get_consumer(session: AsyncSession, query: Optional[Any] = None):
    stmt = select(ConsumerMeter)
    if query:
        stmt = stmt.where(or_(
            ConsumerMeter.account_no.ilike(f"%{query}%"),
            ConsumerMeter.account_name.ilike(f"%{query}%"),
            ConsumerMeter.meter_brand.ilike(f"%{query}%"),
            ConsumerMeter.meter_no.ilike(f"%{query}%")
            ))
    return (await session.execute(stmt)).scalars().all()

