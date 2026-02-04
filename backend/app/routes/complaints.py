from fastapi import APIRouter, status, Depends, Form
from fastapi.exceptions import HTTPException
from sqlalchemy import select
from ..dependencies.db_session import get_session
from ..utils.token import get_current_user
from ..schema.form import CreateComplaints
from sqlalchemy.ext.asyncio.session import AsyncSession
from geoalchemy2.functions import ST_Point
from ..models import Complaints, Users


router = APIRouter(prefix="/complaints", tags=["Complaints"])

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
    
    location = ST_Point(form.latitude, form.longitude, srid=4326)
    new_complaints = Complaints(
        subject = form.subject,
        description = form.description,
        reference_pole = "Pole1",
        location = location,
        
    )
    