from fastapi import APIRouter, Depends,status, Form, HTTPException
from ..services.get import GetEventServices
from ..schema.requests import AgmaEventSetup
from ...user.schema.response_model import UserModel
from ....core.security import get_current_user
from ..services.post import PostEventServices
from ..schema.response import EventSchedule
from typing import List
router = APIRouter(
    prefix="/events",
    tags=["events"],
)


@router.get("/agma/", status_code=200)
async def get_events(get_services = Depends(GetEventServices)):
    return await get_services.getAgmaEvents()
    

@router.get("/agma/schedules", status_code=200, response_model=List[EventSchedule])
async def get_agma_schedule(get_services = Depends(GetEventServices)):
    return await get_services.getAgmaEventsSchedule()