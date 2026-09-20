from fastapi import HTTPException, status, APIRouter, Depends, Query

from ..services.get import GetServicesDT



router = APIRouter(prefix="/dt", tags=["Gis", "Distribution Transformer"])



@router.get("/")
async def distribution_transformer(get_services:GetServicesDT=Depends(GetServicesDT)):
    return await get_services.get_distribution_transformer()


@router.get("/connected_consumers")
async def connected_consumer(dt:str = Query(None), get_services:GetServicesDT=Depends(GetServicesDT)):
    return await get_services.get_connected_consumers(dt)