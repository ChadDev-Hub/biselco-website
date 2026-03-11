from geoalchemy2.shape import to_shape
from geojson import Point, Feature
from shapely.geometry import mapping
from sqlalchemy import select, or_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from ..model.consumer import ConsumerMeter
from .....dependencies.db_session import get_session
from ...franchise_area.model.villages import Village
from ...franchise_area.model.municipality import Municipality
from typing import Optional, Any, List
from ..schema.response_model import Consumer
from geoalchemy2.functions import ST_AsGeoJSON
import json
async def get_consumer(session: AsyncSession, query: Optional[Any] = None):
    stmt = (select(
        ST_AsGeoJSON(ConsumerMeter.geom).label("geolocation"),
        ConsumerMeter.account_no,
        ConsumerMeter.account_name,
        ConsumerMeter.meter_brand,
        ConsumerMeter.meter_no,
        Village.name.label("village"),
        Municipality.name.label("municipality"))
        .select_from(ConsumerMeter)
        .join(Village).join(Municipality))
    if query:
        stmt = stmt.where(or_(
            ConsumerMeter.account_no.ilike(f"%{query}%"),
            ConsumerMeter.account_name.ilike(f"%{query}%"),
            ConsumerMeter.meter_brand.ilike(f"%{query}%"),
            ConsumerMeter.meter_no.ilike(f"%{query}%"),
            Village.name.ilike(f"%{query}%"),
            Municipality.name.ilike(f"%{query}%")
        )).limit(60)
    else:
        return []
    results = (await session.execute(stmt)).mappings().all()
    data = [
        Consumer(
            account_no=result["account_no"],
            account_name=result["account_name"],
            meter_brand=result["meter_brand"],
            meter_no=result["meter_no"],
            village=result["village"],
            municipality=result["municipality"],
            geolocation=json.loads(result["geolocation"])
        ) for result in results]
    
    return data
