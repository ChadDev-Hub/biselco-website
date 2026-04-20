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
                NewConnection.remarks,
                NewConnection.geom
                ))
            .order_by(NewConnection.times_tamped.desc()))
    data = (await session.execute(stmt)).scalars().all()
    results = [
        {
            "id": nc.id,
            "date_accomplished": nc.date_accomplished,
            "consumer_name": nc.consumer_name,
            "location": nc.location,
            "meter_serial_no": nc.meter_serial_no,
            "meter_brand": nc.meter_brand,
            "meter_sealed": nc.meter_sealed,
            "initial_reading": nc.initial_reading,
            "multiplier": nc.multiplier,
            "accomplished_by": nc.accomplished_by,
            "remarks": nc.remarks,
            "geom": ST_AsGeoJSON(to_shape(nc.geom))}
        for nc in data
    ]
    return results
