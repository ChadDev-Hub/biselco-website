from ..model.new_connection import NewConnection
from sqlalchemy import select
from sqlalchemy.orm import selectinload, load_only
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status
from geoalchemy2.functions import ST_AsGeoJSON
from geoalchemy2.shape import to_shape
from shapely.geometry import Point

async def get_new_connection(session: AsyncSession):
    stmt = (select(NewConnection)
            .options(selectinload(NewConnection.images))
            .options(load_only(
                NewConnection.id,
                NewConnection.date_accomplished,
                NewConnection.consumer_name,
                NewConnection.location,
                NewConnection.meter_serial_no,
                NewConnection.meter_brand,
                NewConnection.meter_sealed,
                NewConnection.initial_reading,
                NewConnection.multiplier,
                NewConnection.accomplished_by,
                NewConnection.remarks
                ))
            .order_by(NewConnection.times_tamped.desc()))
    data = (await session.execute(stmt)).scalars().all()  
    return data
