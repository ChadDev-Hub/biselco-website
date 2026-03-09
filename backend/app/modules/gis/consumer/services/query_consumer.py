from sqlalchemy import select 
from sqlalchemy.ext.asyncio import AsyncSession
from ..model.consumer import ConsumerMeter



async def get_consumer(query:any, session:AsyncSession):
    stmt = select(ConsumerMeter)
    if query:
        stmrt = stmt.where(ConsumerMeter.account_no == query)
    