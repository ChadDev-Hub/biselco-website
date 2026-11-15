from fastapi import HTTPException, status, APIRouter, Depends, Query
from ..schema.transformer_type import TransformerType
from ..services.get import GetServicesDT
from typing import List


router = APIRouter(prefix="/dt", tags=["Gis", "Distribution Transformer"])



@router.get("/")
async def distribution_transformer(get_services:GetServicesDT=Depends(GetServicesDT)):
    return await get_services.get_distribution_transformer()


@router.get("/connected_consumers")
async def connected_consumer(dt:str = Query(None), get_services:GetServicesDT=Depends(GetServicesDT)):
    return await get_services.get_connected_consumers(dt)



@router.get("/type", response_model=List[TransformerType])
async def transformer_type(get_services:GetServicesDT=Depends(GetServicesDT)):
    return await get_services.get_transformer_type()