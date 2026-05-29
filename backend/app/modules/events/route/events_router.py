from fastapi import APIRouter, Depends, status, Body, HTTPException
from ..services.get import GetEventServices
from ..schema.requests import AgmaEventSetup
from ...user.schema.response_model import UserModel
from ....core.security import get_current_user
from ..services.post import PostEventServices
from ..schema.response import EventSchedule
from typing import List
from ..schema.requests import ScheduleEvent
router = APIRouter(
    prefix="/events",
    tags=["events"],
)


@router.get("/agma/", status_code=200)
async def get_events(get_services=Depends(GetEventServices)):
    return await get_services.getAgmaEvents()


@router.post("/agma/schedules", status_code=status.HTTP_201_CREATED)
async def post_sched(
    data: List[ScheduleEvent] = Body(), 
    post_service: PostEventServices = Depends(PostEventServices)):
    return await post_service.agma_event_schedule(data)


@router.get("/agma/schedules", status_code=200, response_model=List[EventSchedule])
async def get_agma_schedule(get_services=Depends(GetEventServices)):
    return await get_services.getAgmaEventsSchedule()
