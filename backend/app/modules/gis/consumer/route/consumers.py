from fastapi import APIRouter, status, Depends, HTTPException, Query
from .....dependencies.db_session import get_session
from sqlalchemy.ext.asyncio.session import AsyncSession
from sqlalchemy import select
from typing import Optional
from ..services.query_consumer import get_consumer
from ..schema.response_model import Consumer
from ....user.service.get_user import GetUserServices
from geojson_pydantic import Feature, Point
from ..services.get import ConsumerMeterGetService
    
router = APIRouter(prefix="/consumers", tags=["Consumers"])


@router.get("", status_code=status.HTTP_200_OK, response_model=list[Consumer])
async def query_consumer(session:AsyncSession = Depends(get_session), q:Optional[str] = Query(None),
                         get_user:GetUserServices = Depends(GetUserServices)):
    await get_user.get_current_user(is_admin_transaction=True)
    result = await get_consumer(session=session, query=q)
    return result


@router.get("/all", status_code=status.HTTP_200_OK, response_model=list[Feature[Point, dict]])
async def get_all_consumers(
    get_services: ConsumerMeterGetService = Depends(ConsumerMeterGetService)
):
    return await get_services.get_consumer_meters()
