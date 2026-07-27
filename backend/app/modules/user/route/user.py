from typing import Annotated
from fastapi import APIRouter, Depends, Cookie
from fastapi.responses import JSONResponse
from ..service.get_user import GetUserServices
from typing import Optional
from ..schema.response_model import UserModel
router = APIRouter(prefix="/users", tags=["Users"])




@router.get("/me", status_code=200, response_model=dict)
async def get_me(get_service:GetUserServices = Depends(GetUserServices)):
    user = await get_service.get_current_user()
    return user.model_dump(mode="json")
