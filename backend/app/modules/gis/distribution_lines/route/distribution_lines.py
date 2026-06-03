from fastapi import APIRouter, Depends
from ..services.get import DistributionLineGetServices


router = APIRouter(prefix="/dl", tags=["Gis", "Distribution Line"])


@router.get("/primary_lines")
async def primary_lines(get_services:DistributionLineGetServices=Depends(DistributionLineGetServices)):
    return await get_services.get_primary_lines()