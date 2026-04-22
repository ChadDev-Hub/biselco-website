from fastapi import HTTPException, status, Body, Depends
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from ..model.new_connection import NewConnection, NewConnectionImage
from geoalchemy2.functions import ST_Point
from typing import Optional
from shapely import Point
from geoalchemy2.shape import to_shape
from pprint import pprint
from ..schema.requests_model import NewConnectionReportRequests
from .....dependencies.db_session import get_session
async def create_new_connection(session: AsyncSession, new_connection: dict, image: Optional[str] = None):
    stmt = NewConnection(**new_connection)
    try:
        session.add(stmt)
        await session.flush()
        if image:
            session.add(NewConnectionImage(
                new_connection_id=stmt.id,
                image=image))
        await session.commit()
        results = (await session.execute(
            select(NewConnection)
            .options(selectinload(NewConnection.images))
            .where(NewConnection.id == stmt.id))).scalar_one()
        try:
            coordinates = Point(to_shape(results.geom).coords)
            new_connection_data = {
                "id": results.id,
                "date_accomplished": results.date_accomplished,
                "consumer_name": results.consumer_name,
                "location": results.location,
                "meter_serial_no": results.meter_serial_no,
                "meter_brand": results.meter_brand,
                "meter_sealed": results.meter_sealed,
                "initial_reading": results.initial_reading,
                "multiplier": results.multiplier,
                "accomplished_by": results.accomplished_by,
                "remarks": results.remarks,
                "images": [image.image for image in results.images],
                "geom" : {
                    "type": "Point",
                    "coordinates": [coordinates.x, coordinates.y],
                    "srid": results.geom.srid
                }
            }
            return {
                "detail": "new_connection_created",
                "data": "New Meter Connection Submitted"
            }
        except Exception as e:
            print(e)
        return new_connection
    except Exception as e:
        await session.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


async def download_new_connection_report(session:AsyncSession=Depends(get_session), data:NewConnectionReportRequests=Body(...)):
    try:
        print(data)
        return data
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))