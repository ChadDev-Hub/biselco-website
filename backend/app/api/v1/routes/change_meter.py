from fastapi import APIRouter, status, Query, Depends, HTTPException, Form, UploadFile, File, Body
from fastapi.responses import StreamingResponse
from ....dependencies.db_session import get_session
from ....modules.gis.franchise_area.services.get_location import verifyLocation
from sqlalchemy.ext.asyncio.session import AsyncSession
from typing import Optional
from ....core.websocket_manager import manager
from ....modules.gis.franchise_area.schema.response_model import VerifiedLocation
from ....modules.user.schema.response_model import UserModel
from ....core.security import get_current_user
from pydantic import BaseModel
from typing import Annotated
from ....modules.user.service.get_user import get_users_by_roles
from ....common.geo import extract_address_from_image
from ....modules.technical import  ChangeMeter
from ....modules.technical.change_meter.schema.requests_model import ChangeMeterReport
from ....modules.technical.change_meter.schema.response_model import ChangeMeterResponseList, ChangeMeterResponse
from geoalchemy2.shape import to_shape
from shapely.geometry import Point
import datetime
from ....modules.technical.change_meter.services.get_change_meter import get_change_meter, deleteChangeMeter, get_change_meter_stats, changeMeterReport
from sqlalchemy import select, func
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
    session: AsyncSession = Depends(get_session),
    page:Optional[int] = Query(None),
    ):  
    # CHECK IF THE USER IS ADMIN IF NOT RAISE AN ERROR
    if "admin" not in [role.name.lower() for role in user.roles]:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Admin Only Transaction Allowed")
        
    
    # CHECK AND VERIFY IF THE IMAGE HAS GEOLOCATION IF NOT THEN USE THE VERIFIED LOCATION FROM MAP PIN
    location = None
    if attachment:
        extracted_point = await extract_address_from_image(attachment, session=session)
        location = extracted_point
        
        if not extracted_point:
            location = verified_location
    
    # RAISE EXCEPTION IF LOCATION IS NONE
    if not location:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="location not Provided")
    
    # CHECK IF THE USER IS ADMIN IF NOT RAISE AN ERROR
    # CREATE NEW CHANGE METER
    try: 
        new_change_meter = ChangeMeter(
            form_id = 3,
            timestamped = datetime.datetime.now(),
            date_accomplished=datetime.datetime.strptime(dateAccomplished, "%Y-%m-%d").date(),  
            account_no=accountNumber,
            consumer_name=consumerName,
            location=f"{location.village} | {location.municipality}",
            pull_out_meter=f"{pullOutMeterNumber} | {pullOutMeterBrand}",
            pull_out_meter_reading=int(pullOutMeterReading),
            new_meter_serial_no=NewMeterNumber,
            new_meter_brand=NewMeterBrand,
            meter_sealed=int(NewMeterSealed),
            initial_reading=int(InitialMeterReading),
            remarks=remarks,
            accomplished_by=accomplishedBy,
            geom=location.geom
        )
        session.add(new_change_meter)
        await session.commit()
        await session.refresh(new_change_meter)
        
        # GET ADMIN USER
        admin_user = await get_users_by_roles(session=session, roles="admin")
       
        change_meter_data = await get_change_meter(session=session, page=page)
        data = ChangeMeterResponseList.model_validate(change_meter_data).model_dump(mode="json")
        data['detail'] = "post_change_meter"
        for admin in admin_user:
            await manager.broad_cast_personal_json(user_id=str(admin), data=data)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    return {"detail" : "Change Meter Created Successfully"}
    
        
@router.get("/", status_code=status.HTTP_200_OK, response_model=ChangeMeterResponseList)
async def fetch_change_meter(
    session: AsyncSession = Depends(get_session), 
    q: Optional[str] = Query(None),
    p: Optional[int] = Query(None)):
    # GET CHANGE METER
    return await get_change_meter(session=session, query=q, page=p)



@router.delete("/", status_code=status.HTTP_200_OK)
async def delete_change_meter(session:AsyncSession = Depends(get_session), items:set = Body(...), page:Optional[int] = Query(None)):
    data = await deleteChangeMeter(session=session, items=items, page=page)
    admins = await get_users_by_roles(session=session, roles="admin")
    new_data = ChangeMeterResponseList.model_validate(data).model_dump(mode="json")
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

