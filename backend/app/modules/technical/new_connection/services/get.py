from ..model.new_connection import NewConnection
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status



async def get_new_connection(session: AsyncSession):
    stmt = (select(
        NewConnection.date_accomplished,
        NewConnection.consumer_name,
        NewConnection.meter_serial_no,
        NewConnection.meter_brand,
        NewConnection.meter_sealed,
        NewConnection.initial_reading,
        NewConnection.location,
        NewConnection.multiplier,
        NewConnection.remarks,
        NewConnection.accomplished_by
    ))

    data = (await session.execute(stmt)).mappings().all()   
    return data
