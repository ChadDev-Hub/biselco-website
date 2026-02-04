from fastapi import APIRouter, status, Depends, Form
from fastapi.exceptions import HTTPException
from sqlalchemy import select
from ..dependencies.db_session import get_session
from ..utils.token import get_current_user
from ..schema.form import CreateComplaints
from sqlalchemy.ext.asyncio.session import AsyncSession
from geoalchemy2.functions import ST_Point, ST_X, ST_Y, ST_SRID
from ..models import Complaints, Users
from datetime import date, datetime


router = APIRouter(prefix="/complaints", tags=["Complaints"])


@router.get("/", status_code=status.HTTP_200_OK)
async def get_complaints(user:dict = Depends(get_current_user), session:AsyncSession = Depends(get_session)):
    exception = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized Transaction")
    if not user:
        raise exception
    user_id = user.get("userid")
    complaints = (await session.execute(
        select(
            Complaints.id,
            Complaints.subject,
            Complaints.description,
            Complaints.village,
            Complaints.municipality,
            ST_Y(Complaints.location).label("latitude"),
            ST_X(Complaints.location).label("longitude"),
            ST_SRID(Complaints.location).label("srid")
            ).where(Complaints.user_id == user_id))).mappings().all()
    return complaints


@router.post("/create", status_code=status.HTTP_201_CREATED)
async def create_complaints(
    user:dict = Depends(get_current_user), 
    session:AsyncSession = Depends(get_session), 
    form:CreateComplaints = Form()):
    
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized Transaction")
    user_id = user.get("userid")
    current_user = await session.scalar(select(Users).where(Users.id == user_id))
    
    if not current_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized User")
    
    location = ST_Point(form.longitude, form.latitude,  srid=4326)
    new_complaints = Complaints(
        subject = form.subject,
        description = form.description,
        reference_pole = "Pole1",
        location = location,
        village = "Bintuan",
        municipality = "Coron",
        date = datetime.now().date(),
        time_started = datetime.now().time(),
        status = "RECEIVE",
        user = current_user
    )
    session.add(new_complaints)
    await session.commit()
    await session.refresh(new_complaints, attribute_names=["user"])
    return {
        "detail" : "Complaints Submitted"
    }
    