from fastapi import APIRouter, status, Query, Depends
from ....dependencies.db_session import get_session
from ....modules.gis.franchise_area.services.get_location import GetLocation
from sqlalchemy.ext.asyncio.session import AsyncSession
from typing import Optional, List
from ....modules.gis.franchise_area.schema.response_model import SelectedLocation
router = APIRouter(prefix="/change-meter", tags=["Electric Meter"])


@router.get("/location", status_code=status.HTTP_200_OK, response_model=SelectedLocation)
async def get_meter_info(q:Optional[List[float]] = Query(None), session:AsyncSession = Depends(get_session)):
    return await GetLocation(geometry=q, session=session)


