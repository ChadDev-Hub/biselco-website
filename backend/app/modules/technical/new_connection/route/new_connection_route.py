from ..services.put import PutNewConnectionService
from ..schema.requests_model import NewConnectionSyncRequests
import json
from typing import List
from .....core.redis import CHANNEL, redis_client
from fastapi import APIRouter, HTTPException, status, Depends, File, UploadFile, Form, Query, Body
from .....dependencies.db_session import get_session
from sqlalchemy.ext.asyncio import AsyncSession
from ..schema.requests_model import NewConnectionRequest
from ..services.get import GetServices
from ....gis.franchise_area.services.get_location import verifyLocation
from ....gis.franchise_area.schema.response_model import VerifiedLocation
from .....common.geo import extract_address_from_image
from ....user.service.get_user import GetUserServices
from .....dependencies.bucket3 import upload_image
from ..services.delete import delete_new_connection
from typing import Optional
from datetime import datetime
from ..services.post import PostServices
from ..schema.response_model import NewConnectionInitialData
router = APIRouter(prefix="/new_connection", tags=["New Connection"])


@router.post("/", status_code=status.HTTP_201_CREATED)
async def new_connection(post_new_connection_services: PostServices = Depends(PostServices),
                         date: str = Form(...),
                         consumer_name: str = Form(...),
                         meter_serial_number: str = Form(...),
                         meter_brand: str = Form(...),
                         meter_sealed: Optional[str] = Form(None),
                         multiplier: Optional[int] = Form(None),
                         initial_reading: int = Form(...),
                         attachment: UploadFile = File(...),
                         accomplished_by: str = Form(...),
                         location: VerifiedLocation = Depends(verifyLocation),
                         remarks: Optional[str] = Form(None),
                         get_user_services: GetUserServices = Depends(
                             GetUserServices)
                         ):
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
    response = await post_new_connection_services.create_new_connection( new_connection=data, image=attachment)
    admins = await get_user_services.get_users_by_roles(roles="admin")
    payload = {
        "type": "admins",
        "user_ids": admins,
        "data": response
    }
    await redis_client.publish(CHANNEL, json.dumps(payload))
    # QUERY ADMINS
    return {"detail": "New Connection Created Successfully"}


@router.post("/check_image_location/", status_code=status.HTTP_200_OK)
async def check_image(image_location: VerifiedLocation = Depends(extract_address_from_image)):
    if not image_location:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Image Doesn't Have Location Please pin the Exact Location")
    return {
        "location": image_location.village,
        "lat": image_location.lat,
        "lon": image_location.lon,
        "srid": image_location.geom.srid
    }


@router.get("", status_code=status.HTTP_200_OK, response_model=NewConnectionInitialData)
async def get_nconnection(session: AsyncSession = Depends(get_session),
                          page: Optional[int] = Query(None),
                          search: Optional[str] = Query(None),
                          change_meter_get_services: GetServices = Depends(GetServices)):
    return await change_meter_get_services.get_new_connection(page=page if page else 1, search=search)


@router.delete("/", status_code=status.HTTP_200_OK)
async def del_n_connection(deleted=Depends(delete_new_connection), get_user_services: GetUserServices = Depends(GetUserServices)):
    admins = await get_user_services.get_users_by_roles(roles="admin")
    payload = {
        "type": "admins",
        "user_ids": admins,
        "data": deleted
    }
    await redis_client.publish(CHANNEL, json.dumps(payload))
    return {
        "detail": "New Connection Deleted Successfully"
    }


@router.post("/excel/report", status_code=status.HTTP_200_OK)
async def download_report(new_connection_post_services: PostServices = Depends(PostServices), data: NewConnectionRequest = Body(...)):
    return await new_connection_post_services.download_new_connection_report(data=data)



@router.put("/sync", status_code=status.HTTP_200_OK)
async def new_connection_sync(
    data: NewConnectionSyncRequests = Form(...),
    put_services: PutNewConnectionService = Depends(PutNewConnectionService)
):
    # CHECK USER
    return await put_services.sync_new_connection(data=data)
