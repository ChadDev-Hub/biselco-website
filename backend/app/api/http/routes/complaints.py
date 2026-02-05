from fastapi import APIRouter, status, Depends, Form, WebSocketDisconnect, WebSocket
from fastapi.exceptions import HTTPException
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from ....dependencies.db_session import get_session
from ....utils.token import get_current_user, get_current_user_ws
from ....schema.form import CreateComplaints
from sqlalchemy.ext.asyncio.session import AsyncSession
from geoalchemy2.functions import ST_Point, ST_X, ST_Y, ST_SRID
from ....models import Complaints, Users, Roles, ComplaintsStatusName, ComplaintsStatusUpdates
from datetime import date, datetime
from ....core.websocket_manager import manager

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
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized Transaction")
    current_user = await session.scalar(select(Users).where(Users.id == user_id))
    if not current_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized User")
    
    # GET RECEIVED COMPLAINTS
    received = (await session.execute(
        select(ComplaintsStatusName).where(ComplaintsStatusName.status_name == "Received"))
    ).scalars().one_or_none()
    if not received:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Complaints Status Not Found")
    
    # CREATE COMPLAINT
    location = ST_Point(form.longitude, form.latitude, srid=4326)
    new_complaints = Complaints(
        subject = form.subject,
        description = form.description,
        reference_pole = "Pole1",
        location = location,
        village = "Bintuan",
        municipality = "Coron",
        user = current_user,
        status = ComplaintsStatusUpdates(
            date = datetime.now().date(),
            time = datetime.now().time(),
            status = received)
    )
    session.add(new_complaints)
    await session.commit()
    await session.refresh(new_complaints, attribute_names=["user", "status_update"])
    return new_complaints
    # # SEND TO SPECIFIC CLIENT
    # data = {
    #     "detail" : "Complaints Submitted",
    #     "id" : new_complaints.id,
    #     "subject" : new_complaints.subject,
    #     "description" : new_complaints.description,
    #     "village" : new_complaints.village,
    #     "municipality" : new_complaints.municipality,
    # }
    # await manager.broad_cast_personal_json(user_id=user_id, data=data)
    
    
    
    # # SEND TO ADMIN CLIENT
    #  # ADMIN USER
    # admins = (await session.execute(select(Roles).options(selectinload(Roles.users)).where(Roles.name == "admin"))).scalar()
    # if not admins:
    #     raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No Admin Found")
    # admin_ids = [admin_user.id for admin_user in admins.users]
    # for admin_id in admin_ids:
    #     await manager.broad_cast_personal_json(user_id=admin_id, data=data)
    # await session.close()
    return {
        "detail" : "Complaints Submitted"
    }
    
    