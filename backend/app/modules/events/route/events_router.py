from fastapi import APIRouter, Depends,status, Form, HTTPException
from ..services.get import GetEventServices
from ..schema.requests import AgmaEventSetup
from ...user.schema.response_model import UserModel
from ....core.security import get_current_user
from ..services.post import PostEventServices
router = APIRouter(
    prefix="/events",
    tags=["events"],
)


@router.get("/agma/", status_code=200)
async def get_events(get_services = Depends(GetEventServices)):
    return await get_services.getAgmaEvents()
    

@router.post("/agma/setup", status_code=status.HTTP_201_CREATED)
async def setup(
    data: AgmaEventSetup = Form(...),
    post_services=Depends(PostEventServices),
    user: UserModel = Depends(get_current_user),
):
    if "admin" not in [role.name.lower() for role in user.roles]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail="Admin Only Transaction Allowed")
    res = await post_services.setup_agma_event(data=data)
    return res
