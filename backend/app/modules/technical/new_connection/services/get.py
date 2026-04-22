from ..model.new_connection import NewConnection
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload, load_only
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status
from geoalchemy2.functions import ST_AsGeoJSON
from geoalchemy2.shape import to_shape
from shapely.geometry import Point
from pprint import pprint
from typing import Optional

PAGESIZE=9
async def get_new_connection(session: AsyncSession, page:Optional[int] = None):
    if page is None: 
        page = 1
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
            .order_by(NewConnection.times_tamped.desc())
            .offset((page-1)*PAGESIZE).limit(PAGESIZE))
    total_page_stmt = (await session.execute(select(func.count(NewConnection.id)))).scalar()
    total_page = 1
    if total_page_stmt:
        total_page = total_page_stmt // PAGESIZE if total_page_stmt % PAGESIZE == 0 else total_page_stmt // PAGESIZE + 1
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
            "images": [img.image for img in nc.images],
            "geom": {
                "type": "Point",
                "geometry": Point(to_shape(nc.geom).coords).coords[0],
                "srid" : nc.geom.srid}
            }
        for nc in data
    ]
    return {"data" : results,
            "total_page": total_page}


# GE NEW CONNECTION STATS
async def get_new_connection_stats(session: AsyncSession):
    stmt = (select(func.count(NewConnection.id)))
    session.add(stmt)
    await session.commit()
    return {"total": stmt}  