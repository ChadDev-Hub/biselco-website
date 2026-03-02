from sqlalchemy import select
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from .....db.session import async_session
from sqlalchemy.orm import selectinload
from ..model.boundary import Boundary
from geoalchemy2 import Geometry
from shapely.geometry import mapping
from geoalchemy2.functions import ST_Point, ST_Intersects, ST_SetSRID
from geoalchemy2.shape import to_shape
from typing import List
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