from sqlalchemy import select, or_, cast, Text, func, delete, join, true
from sqlalchemy.ext.asyncio.session import AsyncSession
from ..model.change_meter import ChangeMeter
from geoalchemy2.functions import ST_AsGeoJSON
from typing import Optional
from fastapi import HTTPException, status
import json
PAGE_SIZE = 8

async def get_change_meter_stats(session: AsyncSession):
    total_count = (select(
        func.count().label("total"))
            .select_from(ChangeMeter)).cte("total_count")
    daily_total = (select(
        func.count().label("daily_total"))
                   .select_from(ChangeMeter)
                   .where(ChangeMeter.date_accomplished == func.current_date()
                          )
                   ).cte("daily_total")
    monthly_count = (select(
        func.date_trunc("month", ChangeMeter.date_accomplished).label("month"),
        func.count().label("monthly_count"))
                     .group_by("month")
    ).subquery()
    average_count = (select(
        func.round(func.avg(monthly_count.c.monthly_count)).label("average_count")
    )).cte("average_count")
    
    data =(await session.execute (
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
                "title" : "Total",
                "value" : value,
                "description" : "All"
            }
            new_data.append(total)
        elif key == "daily_total":
            daily = {
                "title" : "Daily",
                "value" : value,
                "description" : "Today"
            }
            new_data.append(daily)
        elif key == "average_count":
            average = {
                "title" : "Avg.",
                "value" : value,
                "description" : "Per month avg."
            }
            new_data.append(average)
    return  new_data
                                                                       
# GET CHANGE METER DATA BY QUERY OR ALL
async def get_change_meter(session: AsyncSession, query: Optional[str] = None, page:Optional[int] = None):
    if not page:
        page = 1
    change_meter_cte = (select(
        ChangeMeter.id,
        ChangeMeter.timestamped,
        ChangeMeter.date_accomplished,
        ChangeMeter.account_no,
        ChangeMeter.consumer_name,
        ChangeMeter.location,
        ChangeMeter.pull_out_meter,
        ChangeMeter.pull_out_meter_reading,
        ChangeMeter.new_meter_serial_no,
        ChangeMeter.new_meter_brand,
        ChangeMeter.meter_sealed,
        ChangeMeter.initial_reading,
        ChangeMeter.remarks,
        ChangeMeter.accomplished_by,
        func.ceil(func.row_number().over(order_by=ChangeMeter.timestamped.desc()) / PAGE_SIZE).label("page"),
        ST_AsGeoJSON(ChangeMeter.geom).label("geom")
    )).cte("change_meter_cte")
    stmt_total  = (await session.execute(select(func.count(ChangeMeter.id)))).scalar()
    total_page = 1
    if stmt_total:
        total_page = stmt_total//PAGE_SIZE if stmt_total%PAGE_SIZE == 0 else stmt_total//PAGE_SIZE + 1
    if query: 
        stmt = select(change_meter_cte).where(
            or_(
                cast(ChangeMeter.timestamped,Text).ilike(f"%{query}%"),
                cast(ChangeMeter.date_accomplished,Text).ilike(f"%{query}%"),
                ChangeMeter.account_no.ilike(f"%{query}%"),
                ChangeMeter.consumer_name.ilike(f"%{query}%"),
                ChangeMeter.location.ilike(f"%{query}%"),
                ChangeMeter.pull_out_meter.ilike(f"%{query}%"),
                cast(ChangeMeter.pull_out_meter_reading,Text).ilike(f"%{query}%"),
                ChangeMeter.new_meter_serial_no.ilike(f"%{query}%"),
                ChangeMeter.new_meter_brand.ilike(f"%{query}%"),
                cast(ChangeMeter.meter_sealed,Text).ilike(f"%{query}%"),
                cast(ChangeMeter.initial_reading,Text).ilike(f"%{query}%"),
                ChangeMeter.remarks.ilike(f"%{query}%"),
                ChangeMeter.accomplished_by.ilike(f"%{query}%"),
            )).order_by(change_meter_cte.c.timestamped.desc())
    else:
        stmt = select(change_meter_cte).where(change_meter_cte.c.page == page).order_by(change_meter_cte.c.timestamped.desc())
    result = (await session.execute(stmt)).mappings().all()
    data = []
    for row in result:
        item = dict(row)
        if item['geom']:
            item['geom'] = json.loads(row['geom'])
        data.append(item)
    
    change_meter_stats = await get_change_meter_stats(session=session)
    return {
        "data": data,
        "total_page": total_page,
        "stats": change_meter_stats
    }
    
    
async def deleteChangeMeter(session:AsyncSession, items:set, page:Optional[int] = None):
    try:
        await session.execute(delete(ChangeMeter).where(ChangeMeter.id.in_(items)))
        await session.commit()
        return await get_change_meter(session=session, page=page)
    except Exception as e:
        await session.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    finally:
        await session.close()