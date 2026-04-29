from fastapi import APIRouter, HTTPException, status, Depends, File, UploadFile, Form, Query
from .....dependencies.db_session import get_session
from sqlalchemy.ext.asyncio import AsyncSession
from ..schema.requests_model import NewConnectionRequest
from ..services.post import create_new_connection, download_new_connection_report
from ..services.get import get_new_connection, get_new_connection_stats
from ....gis.franchise_area.services.get_location import verifyLocation
from ....gis.franchise_area.schema.response_model import VerifiedLocation
from .....common.geo import extract_address_from_image
from ....user.service.get_user import GetUserServices
from .....dependencies.bucket3 import upload_image
from ..services.delete import delete_new_connection
from typing import Optional
from datetime import datetime
from ....websocket.websocket_manager import manager
from ..schema.response_model import NewConnectionInitialData
router = APIRouter(prefix="/new_connection", tags=["New Connection"])



@router.post("/", status_code=status.HTTP_201_CREATED)
async def new_connection(session: AsyncSession = Depends(get_session), 
                         date: str = Form(...),
                         consumer_name: str = Form(...),
                         meter_serial_number: str = Form(...),
                         meter_brand: str = Form(...), 
                         meter_sealed: Optional[str] = Form(None),
                         multiplier: Optional[int] = Form(None),
                         initial_reading: int = Form(...),
                         attachment:UploadFile = File(...),
                         accomplished_by: str = Form(...),
                         location: VerifiedLocation = Depends(verifyLocation),
                         image_location: VerifiedLocation = Depends(extract_address_from_image),
                         remarks: Optional[str] = Form(None),
                         get_user_services: GetUserServices = Depends(GetUserServices)
                         ):
    loc  = None
    if image_location:
        loc = image_location
    else:
        loc = location
    data = {
        "form_id": 4,
        "date_accomplished": datetime.strptime(date, "%Y-%m-%d").date(),
        "consumer_name": consumer_name,
        "meter_serial_no": meter_serial_number,
        "meter_brand": meter_brand,
        "meter_sealed": meter_sealed,
        "multiplier": multiplier,
        "initial_reading": initial_reading,
        "location": f"{location.village} | {location.municipality}",
        "accomplished_by": accomplished_by,
        "geom": loc.geom,
        "remarks": remarks
    }
    image_url = None
    if attachment:
        image_url = await upload_image(file=attachment, folder="new_connection")
    response = await create_new_connection(session=session, new_connection=data, image=image_url)
    admins = await get_user_services.get_users_by_roles(roles="admin")
    for admin in admins:
        await manager.broad_cast_personal_json(str(admin), response)
    # QUERY ADMINS
    return {"detail": "New Connection Created Successfully"}

@router.get("/",status_code=status.HTTP_200_OK, response_model=NewConnectionInitialData)
async def get_nconnection(session:AsyncSession=Depends(get_session), page: Optional[int] = Query(None)):
    data = await get_new_connection(session=session, page=page)
    return data

@router.delete("/", status_code=status.HTTP_200_OK)
async def del_n_connection(deleted=Depends(delete_new_connection), get_user_services:GetUserServices = Depends(GetUserServices)):
    admins = await get_user_services.get_users_by_roles(roles="admin")
    for admin in admins:
        await manager.broad_cast_personal_json(str(admin), deleted)
    return {
        "detail" : "New Connection Deleted Successfully"
    }
    
@router.post("/excel/report", status_code=status.HTTP_200_OK)
async def download_report(data = Depends(download_new_connection_report)):
    return data



@router.get("/stats")
async def new_connection_stats(session: AsyncSession = Depends(get_session)):
    return await get_new_connection_stats(session=session)