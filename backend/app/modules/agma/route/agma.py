from fastapi import APIRouter, Depends, Form, HTTPException, status, Query
from ..services.post import PostAgmaRegistrationService
from ..schema.request_model import AgmaRegistrationRequest, AgmaValidationRequest
from ....dependencies.bucket3 import upload_image
from ..services.get import GetAgmaRegistrationService
router = APIRouter(prefix="/agma", tags=["agma"])


# AGMA REGISTRATION
@router.post("/register", status_code=201)
async def register_agma(
    data:AgmaRegistrationRequest = Form(...), 
    post_agma_registration_service: PostAgmaRegistrationService = Depends(PostAgmaRegistrationService),
    ):
    registration_data = AgmaRegistrationRequest(
        account_no=data.account_no,
        name=data.name,
        mobile_no=data.mobile_no,
        image=data.image,
        signature=data.signature
    )
    return await post_agma_registration_service.register_agma(data=registration_data)

@router.get("/registered", status_code=status.HTTP_200_OK )
async def get_registered(
    id:str = Query(...),
    get_agma_registration_service: GetAgmaRegistrationService = Depends(GetAgmaRegistrationService),
):  
    data = await get_agma_registration_service.get_registered(id=id)
    return data