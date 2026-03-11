from fastapi import APIRouter, status, Depends, HTTPException, Query
from ....dependencies.db_session import get_session
from sqlalchemy.ext.asyncio.session import AsyncSession
from sqlalchemy import select
from typing import Optional
from ....modules.gis.consumer.services.query_consumer import get_consumer
from ....modules.gis.consumer.schema.response_model import Consumer
router = APIRouter(prefix="/consumers", tags=["Consumers"])


@router.get("/", status_code=status.HTTP_200_OK, response_model=list[Consumer])
async def query_consumer(session:AsyncSession = Depends(get_session), consumer:Optional[str] = Query(None)):
    result = await get_consumer(session=session, query=consumer)
    return result