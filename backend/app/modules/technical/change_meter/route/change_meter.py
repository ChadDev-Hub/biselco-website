from fastapi import APIRouter, status, Query, Depends, HTTPException, Form, UploadFile, File, Body
from fastapi.responses import StreamingResponse
from .....dependencies.db_session import get_session
from ....gis.franchise_area.services.get_location import verifyLocation
from sqlalchemy.ext.asyncio.session import AsyncSession
from typing import Optional
from ....websocket.websocket_manager import manager
from ....gis.franchise_area.schema.response_model import VerifiedLocation
from ....user.schema.response_model import UserModel
from .....core.security import get_current_user
from pydantic import BaseModel
from typing import Annotated
from ....user.service.get_user import get_users_by_roles
from .....common.geo import extract_address_from_image
from ..schema.requests_model import ChangeMeterReport
from ..schema.response_model import ChangeMeterResponseList, NewChangeMeterResponse, DeletedChangeMeterResponse
from geoalchemy2.shape import to_shape
from shapely.geometry import Point
import datetime
from ..services.get import get_change_meter, deleteChangeMeter, changeMeterReport
from ..services.post import post_change_meter
from sqlalchemy import select, func
from .....dependencies.bucket3 import upload_image
router = APIRouter(prefix="/change_meter", tags=["Electric Meter"])


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_change_meter(
    dateAccomplished:Annotated[str, Form()],
    accountNumber:Annotated[str, Form()],
    consumerName:Annotated[str, Form()],
    pullOutMeterNumber:Annotated[str, Form()],
    pullOutMeterBrand:Annotated[str, Form()],
    pullOutMeterReading:Annotated[str, Form()],
    NewMeterNumber:Annotated[str, Form()],
    NewMeterBrand:Annotated[str, Form()],
    NewMeterSealed:Annotated[str, Form()],
    InitialMeterReading:Annotated[str, Form()],
    accomplishedBy:Annotated[str, Form()],
    user:UserModel = Depends(get_current_user),
    remarks:Annotated[Optional[str], Form()] = None,
    attachment: Annotated[Optional[UploadFile], File()] = None,
    verified_location:VerifiedLocation = Depends(verifyLocation),
    image_location:VerifiedLocation = Depends(extract_address_from_image),
    session: AsyncSession = Depends(get_session),
    ):
    # UPLOAD IMAGE TO S3 BUCKET
    
    image_url = None
    if attachment:
        image_url = await upload_image(file=attachment, folder="change_meter")

    
    # CHECK IF THE USER IS ADMIN IF NOT RAISE AN ERROR
    if "admin" not in [role.name.lower() for role in user.roles]:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Admin Only Transaction Allowed")
        
    
    # CHECK AND VERIFY IF THE IMAGE HAS GEOLOCATION IF NOT THEN USE THE VERIFIED LOCATION FROM MAP PIN
    location = None
    
    if image_location:
        location = image_location
    else:
        location = verified_location
    
    # RAISE EXCEPTION IF LOCATION IS NONE
    if not location:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="location not Provided")
    
    # CHECK IF THE USER IS ADMIN IF NOT RAISE AN ERROR
    # CREATE NEW CHANGE METER
    try: 
        new_change_meter = {
            "form_id" : 3,
            "timestamped":datetime.datetime.now(),
            "date_accomplished":datetime.datetime.strptime(dateAccomplished, "%Y-%m-%d").date(),  
            "account_no":accountNumber,
            "consumer_name":consumerName,
            "location":f"{location.village} | {location.municipality}",
            "pull_out_meter":f"{pullOutMeterNumber} | {pullOutMeterBrand}",
            "pull_out_meter_reading":int(pullOutMeterReading),
            "new_meter_serial_no":NewMeterNumber,
            "new_meter_brand":NewMeterBrand,
            "meter_sealed":NewMeterSealed,
            "initial_reading":int(InitialMeterReading),
            "remarks":remarks,
            "accomplished_by":accomplishedBy,
            "geom":location.geom}
        
        change_meter_data = await post_change_meter(session=session, data=new_change_meter, image=image_url)
        
        # GET ADMIN USER
        admin_user = await get_users_by_roles(session=session, roles="admin")
       
        data = NewChangeMeterResponse.model_validate(change_meter_data).model_dump(mode="json")
        print(data)
        for admin in admin_user:
            await manager.broad_cast_personal_json(user_id=str(admin), data=data)
    except Exception as e:
        print(e)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    return {"detail" : "Change Meter Created Successfully"}
    
        
@router.get("/", status_code=status.HTTP_200_OK, response_model=ChangeMeterResponseList)
async def fetch_change_meter(
    session: AsyncSession = Depends(get_session), 
    q: Optional[str] = Query(None),
    page: Optional[int] = Query(None)):
    # GET CHANGE METER
    return await get_change_meter(session=session, query=q, page=page)



@router.delete("/", status_code=status.HTTP_200_OK)
async def delete_change_meter(session:AsyncSession = Depends(get_session), items:set = Body(...), page:Optional[int] = Query(None)):
    data = await deleteChangeMeter(session=session, items=items, page=page)
    admins = await get_users_by_roles(session=session, roles="admin")
    new_data = DeletedChangeMeterResponse.model_validate(data).model_dump(mode="json")
    new_data['detail'] = "deleted_change_meter"
    for admin in admins:
        await manager.broad_cast_personal_json(str(admin), new_data)
    return{
        "detail" : "Change Meter Deleted Successfully"}


@router.post("/excel/report", status_code=status.HTTP_200_OK)
async def change_meter_stats(data:ChangeMeterReport, session: AsyncSession = Depends(get_session)):
    file_stream = await changeMeterReport(
        session=session, 
        items=data.items,
        prepare_name=data.prepared_by,
        prepare_position=data.prepared_position,
        check_name=data.checked_by,
        check_position=data.checked_position,
        approve_name=data.approved_by,
        approve_position=data.approved_position
        
        )
    if file_stream is None:
        raise HTTPException(status_code=404, detail="No data available for report")
    return StreamingResponse(
        content=file_stream, media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={
            "Content-Disposition": "attachment; filename=report.xlsx"
        })

