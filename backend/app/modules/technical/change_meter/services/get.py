from sqlalchemy import select, or_, cast, Text, func, delete, join, true
from sqlalchemy.ext.asyncio.session import AsyncSession
from ..model.change_meter import ChangeMeter, ChangeMeterImage
from geoalchemy2.functions import ST_AsGeoJSON
from typing import Optional
from fastapi import HTTPException, status
from ...services.technical_report import create_technical_report
from ..schema.response_model import ChangeMeterReportResponse
from sqlalchemy.orm import selectinload
from .....common.total_page import get_total_page
from geoalchemy2.shape import to_shape
from shapely.geometry import Point
from pprint import pprint
from datetime import date

PAGE_SIZE = 12


async def get_change_meter_stats(session: AsyncSession):
    total_count = (select(
        func.coalesce(func.count(), 0).label("total"))
        .select_from(ChangeMeter)).cte("total_count")
    daily_total = (select(
        func.count().label("daily_total"))
        .select_from(ChangeMeter)
        .where(ChangeMeter.date_accomplished ==  func.current_date())
    ).cte("daily_total")
    monthly_count = (select(
        func.coalesce(func.count(), 0).label("m_count"))
        .where(func.extract("month", ChangeMeter.date_accomplished) == func.extract("month", func.current_date()))
    ).cte("monthly_count")
    
    data = (await session.execute(
        select(total_count.c.total,
               daily_total.c.daily_total,
               monthly_count.c.m_count)
        .select_from(total_count)
        .join(daily_total, true())
        .join(monthly_count, true()))).mappings().one()
    new_data = []
    for key, value in data.items():
        if key == "total":
            total = {
                "label": "Total",
                "value": value,
                "description": "CM"
            }
            new_data.append(total)
        elif key == "daily_total":
            daily = {
                "label": "Daily",
                "value": value,
                "description": "Today"
            }
            new_data.append(daily)
        elif key == "m_count":
            average = {
                "label": "Monthly",
                "value": value,
                "description": date.today().strftime("%B")
            }
            new_data.append(average)
    return new_data

# GET CHANGE METER DATA BY search OR ALL


async def get_change_meter(session: AsyncSession, search: Optional[str] = None, page: Optional[int] = 1):
    change_meter = (select(
        ChangeMeter
    ).options(selectinload(ChangeMeter.images))
    .order_by(ChangeMeter.timestamped.desc()))
    
    # GET TOTAL PAGE
    total_page = await get_total_page(session=session, model=ChangeMeter, pagesize=PAGE_SIZE)
    if search:
        stmt = change_meter.where(
            or_(
                cast(ChangeMeter.timestamped, Text).ilike(f"%{search}%"),
                cast(ChangeMeter.date_accomplished, Text).ilike(f"%{search}%"),
                ChangeMeter.account_no.ilike(f"%{search}%"),
                ChangeMeter.consumer_name.ilike(f"%{search}%"),
                ChangeMeter.location.ilike(f"%{search}%"),
                ChangeMeter.pull_out_meter.ilike(f"%{search}%"),
                cast(ChangeMeter.pull_out_meter_reading,
                     Text).ilike(f"%{search}%"),
                ChangeMeter.new_meter_serial_no.ilike(f"%{search}%"),
                ChangeMeter.new_meter_brand.ilike(f"%{search}%"),
                cast(ChangeMeter.meter_sealed, Text).ilike(f"%{search}%"),
                cast(ChangeMeter.initial_reading, Text).ilike(f"%{search}%"),
                ChangeMeter.remarks.ilike(f"%{search}%"),
                ChangeMeter.accomplished_by.ilike(f"%{search}%"),
            ))  
    else:
        stmt = change_meter.offset((PAGE_SIZE * (page - 1))).limit(PAGE_SIZE)
    result = (await session.execute(stmt)).scalars().all()

    data = []
    for row in result:
        items = {
            "id": row.id,
            "date_accomplished": row.date_accomplished,
            "account_no": row.account_no,
            "consumer_name": row.consumer_name,
            "location": row.location,
            "pull_out_meter": row.pull_out_meter,
            "pull_out_meter_reading": row.pull_out_meter_reading,
            "new_meter_serial_no": row.new_meter_serial_no,
            "new_meter_brand": row.new_meter_brand,
            "meter_sealed": row.meter_sealed,
            "initial_reading": row.initial_reading,
            "remarks": row.remarks,
            "accomplished_by": row.accomplished_by,
            "images": [im.image for im in row.images],
            "geom": {
                "type": "Point",
                "coordinates": [Point(to_shape(row.geom).coords).x, Point(to_shape(row.geom).coords).y],
                "srid": row.geom.srid
            }
        }
        data.append(items)
    change_meter_stats = await get_change_meter_stats(session=session)
    return {
        "data": data,
        "total_page": total_page,
        "stats": change_meter_stats
    }
    


    


async def deleteChangeMeter(session: AsyncSession, items: set, page: Optional[int] = None):
    try:
        await session.execute(delete(ChangeMeter).where(ChangeMeter.id.in_(items)))
        await session.commit()
        return {
            "data": "Change Meter Deleted Successfully"
        }
    except Exception as e:
        await session.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    finally:
        await session.close()


# CHANGE METER REPORT
async def changeMeterReport(session:AsyncSession, 
                            items: set, 
                            approve_name: Optional[str] = None, 
                            approve_position: Optional[str] = None,
                            check_name: Optional[str] = None, 
                            check_position: Optional[str] = None,
                            prepare_name: Optional[str] = None, 
                            prepare_position: Optional[str] = None
                            ):
    stmt = (await session.execute(
        select(ChangeMeter).where(ChangeMeter.id.in_(items))
    )).scalars().all()
    data = [
        ChangeMeterReportResponse.model_validate(d).model_dump(mode="json")
        for d in stmt
    ]

    if not data:
        return None

    columns = [col.replace("_", " ").upper() for col in data[0].keys()]
    rows = [list(d.values()) for d in data]
    
    return create_technical_report(
        columns=columns,
        rows=rows,
        prepare_name=prepare_name,
        prepare_position=prepare_position,
        check_name=check_name,
        check_position=check_position,
        approve_name=approve_name,
        approve_position=approve_position,
        title="CHANGE METER REPORT"
    )

   
