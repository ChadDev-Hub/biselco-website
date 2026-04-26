from ..model.new_connection import NewConnection
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload, load_only
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status
from geoalchemy2.functions import ST_AsGeoJSON
from geoalchemy2.shape import to_shape
from shapely.geometry import Point
from pprint import pprint
from typing import Optional
from sqlalchemy import true
from ..schema.response_model import NewConnectionData
from typing import Type
from .....common.total_page import get_total_page
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
    total_page = await get_total_page(session=session, model=NewConnection, pagesize=PAGESIZE)
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
                "coordinates": Point(to_shape(nc.geom).coords).coords[0],
                "srid" : nc.geom.srid}
            }
        for nc in data
    ]
    return {"data" : results,
            "total_page": total_page}


# GE NEW CONNECTION STATS
async def get_new_connection_stats(session: AsyncSession):
    total_count = (
        select(func.coalesce(func.count(), 0).label("total"))
        .select_from(NewConnection)
    ).cte("total_count")
    
    daily_total = (
        select(func.count().label("daily_total"))
        .where(NewConnection.date_accomplished == func.current_date())
    ).cte("daily_total")

    monthly_count = (
        select(
            func.date_trunc("month", NewConnection.date_accomplished).label("month"),
            func.coalesce(func.count(), 0).label("monthly_count")
        )
        .group_by("month")
    ).subquery()

    average_count = (
        select(func.coalesce(func.floor(func.abs(func.round(func.avg(monthly_count.c.monthly_count)))), 0).label("average_count"))
    ).cte("average_count")

    data = (await session.execute(
        select(total_count.c.total, daily_total.c.daily_total, average_count.c.average_count)
        .select_from(total_count)
        .join(daily_total, true())
        .join(average_count, true()))).mappings().one()
    return [{
        "label": "Total",
        "value": data["total"],
        "description": "New Connection"
    }, {
        "label": "Daily Total",
        "value": data["daily_total"],
        "description": "Today"
    }, {
        "label": "Monthly Avg.",
        "value": data["average_count"],
        "description": "Monthly Avg."
    }]