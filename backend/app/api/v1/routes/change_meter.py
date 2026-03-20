from fastapi import APIRouter, status, Query, Depends, HTTPException, Form, UploadFile, File
from ....dependencies.db_session import get_session
from ....modules.gis.franchise_area.services.get_location import verifyLocation
from sqlalchemy.ext.asyncio.session import AsyncSession
from typing import Optional, List
from geoalchemy2.functions import ST_SetSRID, ST_Point
from ....modules.gis.franchise_area.schema.response_model import VerifiedLocation
from ....modules.user.schema.response_model import UserModel
from ....core.security import get_current_user
from pydantic import BaseModel
from typing import Annotated
from ....common.geo import extract_address_from_image
from ....modules.technical import  ChangeMeterImage, ChangeMeter
from ....modules.technical.change_meter.schema.response_model import ChangeMeterResponseList
import time
import datetime
from ....modules.technical.change_meter.services.get_change_meter import get_change_meter
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
    lat:Annotated[str, Form()],
    lon:Annotated[str, Form()],
    remarks:Annotated[Optional[str], Form()],
    accomplishedBy:Annotated[str, Form()],
    user:UserModel = Depends(get_current_user),
    attachment: Annotated[Optional[UploadFile], File()] = None,
    verified_location:VerifiedLocation = Depends(verifyLocation),
    session: AsyncSession = Depends(get_session),
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
            times_tamped = datetime.datetime.now(),
            date_accomplished=datetime.datetime.strptime(dateAccomplished, "%Y-%m-%d").date(),  
            account_no=accountNumber,
            consumer_name=consumerName,
            location=f"{location.village} | {location.municipality}",
            pull_out_meter=f"{pullOutMeterNumber} | {pullOutMeterBrand}",
            pull_out_meter_reading=int(pullOutMeterReading),
            new_meter_serial_no=NewMeterNumber,
            new_meter_brand=NewMeterBrand,
            meter_sealed=int(NewMeterSealed),
            inital_reading=int(InitialMeterReading),
            remarks=remarks,
            accomplished_by=accomplishedBy,
            geom=location.geom
        )
        session.add(new_change_meter)
        
        await session.commit()
    except Exception as e:
        print(e)
    return {"detail" : "Change Meter Created Successfully"}
    
        
@router.get("/", status_code=status.HTTP_200_OK, response_model=ChangeMeterResponseList)
async def fetch_change_meter(
    session: AsyncSession = Depends(get_session), 
    q: Optional[str] = Query(None),
    p: Optional[int] = Query(None)):
    # GET CHANGE METER
    return await get_change_meter(session=session, query=q, page=p)





