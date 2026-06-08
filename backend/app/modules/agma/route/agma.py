from fastapi import APIRouter, Depends, Form, HTTPException, status, Query, Response, Body
from ..services.post import PostAgmaRegistrationService
from ..schema.request_model import AgmaRegistrationRequest, AgmaValidationRequest
from ...user.schema.response_model import UserModel
from ....dependencies.bucket3 import upload_image
from ..services.get import GetAgmaRegistrationService
from ....core.security import get_current_user
from ..services.screenshot import generate_ticket
from ...events.schema.requests import AgmaEventSetup
from ..schema.response import AgmaSetup, AgmaCountRegistered, RegisteredOvertime, AgmaStats
from typing import Optional, List
from ..schema.request_model import AccountNumberRequest, Registeredid
from ..schema.response import AgmaSpin, WinnerInfo
from ..services.patch import AgmaRegistrationPatchService
router = APIRouter(prefix="/agma", tags=["agma"])


# AGMA REGISTRATION
@router.post("/register", status_code=201)
async def register_agma(
    data: AgmaRegistrationRequest = Form(...),
    post_agma_registration_service: PostAgmaRegistrationService = Depends(
        PostAgmaRegistrationService),
):
    return await post_agma_registration_service.register_agma(data=data)


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


@router.get("/stats", status_code=status.HTTP_200_OK, response_model=List[AgmaStats])
async def complaints_stats(
    get_agma_registration_service: GetAgmaRegistrationService = Depends(
        GetAgmaRegistrationService),
    user: UserModel = Depends(get_current_user)
):
    if "admin" not in [role.name.lower() for role in user.roles]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail="Admin Only Transaction Allowed")
    return await get_agma_registration_service.get_stats()


@router.get("/registered/all", status_code=status.HTTP_200_OK)
async def get_all(
        get_agma_registration_service: GetAgmaRegistrationService = Depends(
            GetAgmaRegistrationService),
        user: UserModel = Depends(get_current_user),
        page: Optional[int] = Query(None),
        year: Optional[int] = Query(None),
        barangay: Optional[str] = Query(None),
        search: Optional[str] = Query(None)):

    if "admin" not in [role.name.lower() for role in user.roles]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail="Admin Only Transaction Allowed")
    return await get_agma_registration_service.get_all_registered(page=page if page else 1, year=year, barangay=barangay, search=search)


@router.get("/registered/all/filters", status_code=status.HTTP_200_OK)
async def get_agma_filter(
        get_agma_registration_service: GetAgmaRegistrationService = Depends(
            GetAgmaRegistrationService),
        user: UserModel = Depends(get_current_user)):
    if "admin" not in [role.name.lower() for role in user.roles]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail="Admin Only Transaction Allowed")
    return await get_agma_registration_service.get_filters()


@router.post("/setup", status_code=status.HTTP_201_CREATED)
async def setup(
    data: AgmaEventSetup = Form(...),
    post_services=Depends(PostAgmaRegistrationService),
    user: UserModel = Depends(get_current_user),
):
    if "admin" not in [role.name.lower() for role in user.roles]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail="Admin Only Transaction Allowed")
    res = await post_services.setup_agma_event(data=data)
    return res


@router.get("/setup", status_code=status.HTTP_200_OK, response_model=AgmaSetup)
async def get_setup(
    get_services=Depends(GetAgmaRegistrationService),
    user: UserModel = Depends(get_current_user)
):
    if "admin" not in [role.name.lower() for role in user.roles]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail="Admin Only Transaction Allowed")
    res = await get_services.get_agma_setup()
    return res


@router.get("/statistic/count_registered", status_code=status.HTTP_200_OK, response_model=List[AgmaCountRegistered])
async def get_graph(
    get_services: GetAgmaRegistrationService = Depends(
        GetAgmaRegistrationService),
    user: UserModel = Depends(get_current_user),
    municipality: Optional[str] = Query(None)
):
    if "admin" not in [role.name.lower() for role in user.roles]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail="Admin Only Transaction Allowed")
    return await get_services.get_graph_data(municipality=municipality)


@router.get("/statistic/registered_overtime", status_code=status.HTTP_200_OK, response_model=List[RegisteredOvertime])
async def get_registered_overtime(
        get_services: GetAgmaRegistrationService = Depends(GetAgmaRegistrationService)):
    return await get_services.get_registered_overtime()


@router.get("/raffle/initial_entries", status_code=status.HTTP_200_OK, response_model=List[str])
async def get_initial_raffle_entries(
        get_services: GetAgmaRegistrationService = Depends(GetAgmaRegistrationService)):
    return await get_services.get_initial_raffle_entries()


@router.post("/raffle/spin", status_code=status.HTTP_200_OK, response_model=AgmaSpin)
async def spin(
    get_services: GetAgmaRegistrationService = Depends(
        GetAgmaRegistrationService),
):
    return await get_services.raffle_spin()


@router.post("/raffle/winner/info", status_code=status.HTTP_200_OK, response_model=WinnerInfo)
async def get_winner_info(
    data: AccountNumberRequest = Body(...),
    get_services: GetAgmaRegistrationService = Depends(
        GetAgmaRegistrationService),
):
    data = await get_services.winner_info(account_no=data.account_no)
    return data


@router.patch("/raffle/winner/status", status_code=status.HTTP_200_OK)
async def update_winner_status(
    data: Registeredid = Body(...),
    patch_services: AgmaRegistrationPatchService = Depends(
        AgmaRegistrationPatchService)):
    await patch_services.update_winner_status(id=data.id)
    return "Winner Saved Successfully"