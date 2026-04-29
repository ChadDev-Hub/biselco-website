from sqlalchemy import select
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from .....db.session import async_session
from sqlalchemy.orm import selectinload
from ..model.boundary import Boundary
from geoalchemy2 import Geometry
from shapely.geometry import mapping
from geoalchemy2.functions import ST_Point, ST_Intersects, ST_SetSRID
from geoalchemy2.elements import WKTElement
from geoalchemy2.shape import to_shape
from typing import List
from fastapi import Depends, Form
from .....dependencies.db_session import get_session
from ..schema.response_model import VerifiedLocation
from shapely.geometry import Point
async def GetLocation(geometry:List[float], session:AsyncSession):
    stmt = (select(Boundary)
            .options(selectinload(Boundary.villages),
                     selectinload(Boundary.municipal))
            .where(ST_Intersects(Boundary.geom, ST_SetSRID(ST_Point(geometry[0], geometry[1]), 4326))))
    data = (await session.execute(stmt)).scalar_one_or_none()
    if not data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Location not found")
    result = f"{data.municipal.name} | {data.villages.name}"
    return {"location":result}


async def verifyLocation(lon:str = Form(...),
                         lat:str = Form(...),
                         session: AsyncSession= Depends(get_session)) -> VerifiedLocation:
    if not lon or not lat:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Please Provide Location")
    geometry = ST_SetSRID(ST_Point(float(lon), float(lat)),4326)
    stmt = (select(Boundary)
            .options(selectinload(Boundary.villages),
                     selectinload(Boundary.municipal))
            .where(ST_Intersects(Boundary.geom, geometry)))
    data = (await session.execute(stmt)).scalar_one_or_none()
    if not data:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Selected Location Exceeds Franchise Area")
    
    return VerifiedLocation(
        village=data.villages.name,
        municipality=data.municipal.name,
        
        geom = WKTElement('POINT({} {})'.format(lon, lat), srid=4326)    
    )