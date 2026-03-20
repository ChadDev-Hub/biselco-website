from sqlalchemy import select, or_, cast, Text, func
from sqlalchemy.ext.asyncio.session import AsyncSession
from ..model.change_meter import ChangeMeter
from geoalchemy2.functions import ST_AsGeoJSON
from typing import Optional
import json

# GET CHANGE METER DATA BY QUERY OR ALL
async def get_change_meter(session: AsyncSession, query: Optional[str] = None, page:Optional[int] = None):
    PAGE_SIZE = 9
    if not page:
        page = 1
    stmt = (select(
        ChangeMeter.id,
        ChangeMeter.date_accomplished,
        ChangeMeter.account_no,
        ChangeMeter.consumer_name,
        ChangeMeter.location,
        ChangeMeter.pull_out_meter,
        ChangeMeter.pull_out_meter_reading,
        ChangeMeter.new_meter_serial_no,
        ChangeMeter.new_meter_brand,
        ChangeMeter.meter_sealed,
        ChangeMeter.inital_reading,
        ChangeMeter.remarks,
        ChangeMeter.accomplished_by,
        ST_AsGeoJSON(ChangeMeter.geom).label("geom")
    ))
    stmt_total  = (await session.execute(select(func.count(ChangeMeter.id)))).scalar()
    total_page = 1
    if stmt_total:
        total_page = stmt_total//PAGE_SIZE if stmt_total%PAGE_SIZE == 0 else stmt_total//PAGE_SIZE + 1
    if query: 
        stmt = stmt.where(
            or_(
                cast(ChangeMeter.times_tamped,Text).ilike(f"%{query}%"),
                cast(ChangeMeter.date_accomplished,Text).ilike(f"%{query}%"),
                ChangeMeter.account_no.ilike(f"%{query}%"),
                ChangeMeter.consumer_name.ilike(f"%{query}%"),
                ChangeMeter.location.ilike(f"%{query}%"),
                ChangeMeter.pull_out_meter.ilike(f"%{query}%"),
                cast(ChangeMeter.pull_out_meter_reading,Text).ilike(f"%{query}%"),
                ChangeMeter.new_meter_serial_no.ilike(f"%{query}%"),
                ChangeMeter.new_meter_brand.ilike(f"%{query}%"),
                cast(ChangeMeter.meter_sealed,Text).ilike(f"%{query}%"),
                cast(ChangeMeter.inital_reading,Text).ilike(f"%{query}%"),
                ChangeMeter.remarks.ilike(f"%{query}%"),
                ChangeMeter.accomplished_by.ilike(f"%{query}%"),
            ))
    else:
        stmt = stmt.limit(9).offset((page-1)*9)
    stmt = stmt.order_by(ChangeMeter.times_tamped.desc())
    result = (await session.execute(stmt)).mappings().all()
    data = []
    for row in result:
        item = dict(row)
        if item['geom']:
            item['geom'] = json.loads(row['geom'])
        data.append(item)
    return {
        "data": data,
        "total_page": total_page
    }