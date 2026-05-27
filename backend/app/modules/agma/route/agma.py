from fastapi import APIRouter, Depends, Form, HTTPException, status, Query, Response
from ..services.post import PostAgmaRegistrationService
from ..schema.request_model import AgmaRegistrationRequest, AgmaValidationRequest
from ...user.schema.response_model import UserModel
from ....dependencies.bucket3 import upload_image
from ..services.get import GetAgmaRegistrationService
from ....core.security import get_current_user
from ..services.screenshot import generate_ticket
from typing import Optional
router = APIRouter(prefix="/agma", tags=["agma"])


# AGMA REGISTRATION
@router.post("/register", status_code=201)
async def register_agma(
    data: AgmaRegistrationRequest = Form(...),
    post_agma_registration_service: PostAgmaRegistrationService = Depends(
        PostAgmaRegistrationService),
):
    registration_data = AgmaRegistrationRequest(
        account_no=data.account_no,
        name=data.name,
        mobile_no=data.mobile_no,
        image=data.image,
        signature=data.signature
    )
    return await post_agma_registration_service.register_agma(data=registration_data)


@router.get("/registered", status_code=status.HTTP_200_OK)
async def get_registered(
    id: str = Query(...),
    get_agma_registration_service: GetAgmaRegistrationService = Depends(
        GetAgmaRegistrationService),
):
    data = await get_agma_registration_service.get_registered(id=id)
    return data


@router.get("/ticket", status_code=status.HTTP_200_OK)
async def downlaod_ticket(
    id: str = Query(...),
    path: str = Query(...),
):
    screenshot = await generate_ticket(id, path)
    return Response(content=screenshot, media_type="image/png")


@router.get("/stats", status_code=status.HTTP_200_OK)
async def complaints_stats(get_agma_registration_service: GetAgmaRegistrationService = Depends(GetAgmaRegistrationService)):
    return await get_agma_registration_service.get_stats()


@router.get("/registered/all", status_code=status.HTTP_200_OK)
async def get_all(
    get_agma_registration_service: GetAgmaRegistrationService = Depends(GetAgmaRegistrationService),
    user: UserModel = Depends(get_current_user),
    page: Optional[int] = Query(None),
    year: Optional[int] = Query(None),
    barangay:Optional[str] = Query(None)):
    
    if "admin" not in [role.name.lower() for role in user.roles]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail="Admin Only Transaction Allowed")
    return await get_agma_registration_service.get_all_registered(page=page if page else 1, year=year, barangay=barangay)

@router.get("/registered/all/filters", status_code=status.HTTP_200_OK)
async def get_agma_filter(
    get_agma_registration_service: GetAgmaRegistrationService = Depends(GetAgmaRegistrationService),
    user: UserModel = Depends(get_current_user)):
    if "admin" not in [role.name.lower() for role in user.roles]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail="Admin Only Transaction Allowed")
    return await get_agma_registration_service.get_filters()

