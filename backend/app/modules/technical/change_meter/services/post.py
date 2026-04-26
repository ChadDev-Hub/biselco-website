from ..model.change_meter import ChangeMeter, ChangeMeterImage
from fastapi import HTTPException, status
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional
from geoalchemy2.shape import to_shape
from shapely.geometry import Point
from .get import get_change_meter_stats
from .....common.total_page import get_total_page

async def post_change_meter(session:AsyncSession, data:dict, image:Optional[str] = None):
    new_change_meter = ChangeMeter(**data)
    try:
        session.add(new_change_meter)
        await session.flush()

        if image:
            session.add(ChangeMeterImage(
                change_meter_id=new_change_meter.id,
                image=image))
        await session.commit()
        await session.refresh(new_change_meter)
        results = (await session.execute(
            select(ChangeMeter)
            .options(selectinload(ChangeMeter.images))
            .where(ChangeMeter.id == new_change_meter.id))).scalar_one()
        geometry= Point(to_shape(results.geom).coords)
        change_meter_data = {
            "id": results.id,
            "date_accomplished": results.date_accomplished,
            "account_no": results.account_no,
            "consumer_name": results.consumer_name,
            "location": results.location,
            "pull_out_meter": results.pull_out_meter,
            "pull_out_meter_reading": results.pull_out_meter_reading,
            "new_meter_serial_no": results.new_meter_serial_no,
            "new_meter_brand": results.new_meter_brand,
            "meter_sealed": results.meter_sealed,
            "initial_reading": results.initial_reading,
            "remarks": results.remarks,
            "accomplished_by": results.accomplished_by,
            "images": [im.image for im in results.images],
            "geom": {
                "type": "Point",
                "coordinates": [geometry.x, geometry.y],
                "srid": results.geom.srid
            }
        }
        change_meter_stats = await get_change_meter_stats(session=session)
        total_page = await get_total_page(session=session, model=ChangeMeter, pagesize=10)
        
        return {
            "detail": "post_change_meter",
            "message": "Change Meter Created",
            "total_page": total_page,
            "data": {
                "change_meter_data" : change_meter_data,
                "change_meter_stats": change_meter_stats,
                
            }
        }
            
        
    except Exception as e:
        await session.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))