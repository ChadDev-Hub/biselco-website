from fastapi import APIRouter, HTTPException, status, Depends, File, UploadFile, Form
from .....dependencies.db_session import get_session
from sqlalchemy.ext.asyncio import AsyncSession
from ..schema.requests_model import NewConnectionRequest
from ..services.post import create_new_connection
from ....gis.franchise_area.services.get_location import verifyLocation
from ....gis.franchise_area.schema.response_model import VerifiedLocation
from typing import Optional
from datetime import datetime
from pprint import pprint

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
                         image:UploadFile = File(...),
                         accomplished_by: str = Form(...),
                         location: VerifiedLocation = Depends(verifyLocation),
                         remarks: Optional[str] = Form(None),
                         ):

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
        "geom": location.geom,
        "remarks": remarks
    }
    response = await create_new_connection(session=session, new_connection=data)
    print(response)
    return {"detail": "New Connection Created Successfully"}