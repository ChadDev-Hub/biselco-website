from fastapi import APIRouter, Depends
from ..services.get import GetEventServices
router = APIRouter(
    prefix="/events",
    tags=["events"],
)


@router.get("/agma/", status_code=200)
async def get_events(get_services = Depends(GetEventServices)):
    return await get_services.getAgmaEvents()
    


