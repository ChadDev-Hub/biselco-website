from sqlalchemy import select, or_, cast, Text, func, delete, join, true
from sqlalchemy.ext.asyncio.session import AsyncSession
from ..model.change_meter import ChangeMeter, ChangeMeterImage
from geoalchemy2.functions import ST_AsGeoJSON
from typing import Optional
from fastapi import HTTPException, status
from ...services.technical_report import create_technical_report
from ..schema.response_model import ChangeMeterReportResponse

from sqlalchemy.orm import selectinload

from geoalchemy2.shape import to_shape
from shapely.geometry import Point
from pprint import pprint
import io

PAGE_SIZE = 8   


async def get_change_meter_stats(session: AsyncSession):
    total_count = (select(
        func.coalesce(func.count(), 0).label("total"))
        .select_from(ChangeMeter)).cte("total_count")
    daily_total = (select(
        func.count().label("daily_total"))
        .select_from(ChangeMeter)
        .where(ChangeMeter.date_accomplished == func.current_date()
               )
    ).cte("daily_total")
    monthly_count = (select(
        func.date_trunc("month", ChangeMeter.date_accomplished).label("month"),
        func.coalesce(func.count(), 0).label("monthly_count"))
        .group_by("month")
    ).subquery()
    average_count = (select(
        func.coalesce(func.floor(func.abs(func.round(
            func.avg(monthly_count.c.monthly_count)))), 0).label("average_count")
    )).cte("average_count")

    data = (await session.execute(
        select(total_count.c.total,
               daily_total.c.daily_total,
               average_count.c.average_count)
        .select_from(total_count)
        .join(daily_total, true())
        .join(average_count, true()))).mappings().one()
    new_data = []
    for key, value in data.items():
        if key == "total":
            total = {
                "title": "Total",
                "value": value,
                "description": "All"
            }
            new_data.append(total)
        elif key == "daily_total":
            daily = {
                "title": "Daily",
                "value": value,
                "description": "Today"
            }
            new_data.append(daily)
        elif key == "average_count":
            average = {
                "title": "Avg.",
                "value": value,
                "description": "Per month avg."
            }
            new_data.append(average)
    return new_data

# GET CHANGE METER DATA BY QUERY OR ALL


async def get_change_meter(session: AsyncSession, query: Optional[str] = None, page: Optional[int] = None):
    if not page:
        page = 1
    change_meter = (select(
        ChangeMeter
    ).options(selectinload(ChangeMeter.images))
    .order_by(ChangeMeter.timestamped.desc()))
    
    # GET TOTAL PAGE 
    stmt_total = (await session.execute(select(func.count(ChangeMeter.id)))).scalar()
    total_page = 1
    if stmt_total:
        total_page = stmt_total//PAGE_SIZE if stmt_total % PAGE_SIZE == 0 else stmt_total//PAGE_SIZE + 1
    if query:
        stmt = change_meter.where(
            or_(
                cast(ChangeMeter.timestamped, Text).ilike(f"%{query}%"),
                cast(ChangeMeter.date_accomplished, Text).ilike(f"%{query}%"),
                ChangeMeter.account_no.ilike(f"%{query}%"),
                ChangeMeter.consumer_name.ilike(f"%{query}%"),
                ChangeMeter.location.ilike(f"%{query}%"),
                ChangeMeter.pull_out_meter.ilike(f"%{query}%"),
                cast(ChangeMeter.pull_out_meter_reading,
                     Text).ilike(f"%{query}%"),
                ChangeMeter.new_meter_serial_no.ilike(f"%{query}%"),
                ChangeMeter.new_meter_brand.ilike(f"%{query}%"),
                cast(ChangeMeter.meter_sealed, Text).ilike(f"%{query}%"),
                cast(ChangeMeter.initial_reading, Text).ilike(f"%{query}%"),
                ChangeMeter.remarks.ilike(f"%{query}%"),
                ChangeMeter.accomplished_by.ilike(f"%{query}%"),
            )).offset((PAGE_SIZE * (page - 1))).limit(PAGE_SIZE)
    else:
        stmt = change_meter.offset((PAGE_SIZE * (page - 1))).limit(PAGE_SIZE)
    result = (await session.execute(stmt)).scalars().all()

    data = []
    for row in result:
        items = {
            "id": row.id,
            "timestamped": row.timestamped,
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
            "images": [{"id": im.id, "image": im.image} for im in row.images],
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
    
async def get_new_change_meter(session:AsyncSession, data:dict, image:Optional[str] = None):
    try:
        new_change_meter = ChangeMeter(**data)
        if image:
            new_change_meter.images.append(ChangeMeterImage(image=image))
        session.add(new_change_meter)
        
        await session.commit()
        await session.refresh(new_change_meter)
        return {
            "data": "New Change Meter Added"
        }
            
        
    except Exception as e:
        await session.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    finally:
        await session.close()
    


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

   
