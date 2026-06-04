from fastapi import HTTPException, status, APIRouter, Depends
from ..services.get import GetServicesDT



router = APIRouter(prefix="/dt", tags=["Gis", "Distribution Transformer"])



@router.get("/")
async def distribution_transformer(get_services:GetServicesDT=Depends(GetServicesDT)):
    return await get_services.get_distribution_transformer()
    
