from sqlalchemy.ext.asyncio.session import AsyncSession
from fastapi import status
from fastapi.exceptions import HTTPException
from sqlalchemy import select, and_, desc, asc
from sqlalchemy.orm import selectinload
from ..models import Complaints, Users, Roles, ComplaintsStatusName, ComplaintsStatusUpdates
from shapely.geometry import Point
from geoalchemy2.shape import to_shape
async def complaints(session:AsyncSession):
    complaints = (await session.execute(
        select(Complaints)
        .join(ComplaintsStatusUpdates)
        .options(selectinload(Complaints.status_updates)
                 .selectinload(ComplaintsStatusUpdates.status))
        .order_by(desc(ComplaintsStatusUpdates.time ))
    )).scalars().all()
    data = []
    for c in complaints:
        geom = to_shape(c.location)
        srid = c.location.srid
        status_list = [{
            "id": s.id,
            "complaint_id": s.complaint_id,
            "name": s.status.status_name,
            "description": s.status.description,
            "date": s.date.isoformat(),
            "time": s.time.strftime("%H:%M %p"),
        } for s in c.status_updates]
        if isinstance(geom, Point):
            complaint = {
                "id": c.id,
                "subject": c.subject,
                "description": c.description,
                "village": c.village,
                "municipality": c.municipality,
                "location": {
                    "latitude": geom.y,
                    "longitude": geom.x,
                    "srid": srid},
            "status": status_list}
        data.append(complaint)
    return data

# NEW COMPLAINT
async def new_complaint(session:AsyncSession, complaint_id:int, user_id:int):
    n_complaint = await session.scalar(
    select(Complaints)
    .options(
        selectinload(Complaints.status_updates)
        .selectinload(ComplaintsStatusUpdates.status)
    )
    .where(and_(Complaints.id == complaint_id, Complaints.user_id == user_id))
    )
    if not n_complaint:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Complaint Not Found")
    # GET STATUS
    status_list = [
    {
        "id": s.id,
        "complaint_id": s.complaint_id,
        "name": s.status.status_name,
        "description": s.status.description,
        "date": s.date.isoformat(),
        "time": s.time.strftime("%H:%M %p")
    }
    for s in n_complaint.status_updates
    ]
    # PROCESS GEOMETRY WBKELEMENTS
    geom = to_shape(n_complaint.location)
    srid = n_complaint.location.srid
    if isinstance(geom, Point):
        location = {
            "latitude": geom.y,
            "longitude": geom.x,
            "srid": srid
        }
    data = {
        "detail" : "complaints",
        "data" : {
             "id" : n_complaint.id,
             "user_id": n_complaint.user_id,
            "subject" : n_complaint.subject,
            "description" : n_complaint.description,
            "village" : n_complaint.village,
            "municipality" : n_complaint.municipality,
            "location" : location,
            "status" : status_list}
    }
    await session.close()
    return data



# GET COMPLAINTS FOR SPECIFIC USER
async def user_complaints(session:AsyncSession, user_id:int):
    complaints = (await session.execute(
        select(Complaints)
        .options(selectinload(Complaints.status_updates)
                 .selectinload(ComplaintsStatusUpdates.status))
        .where(Complaints.user_id == user_id)
        .order_by(desc(Complaints.id))
    )).scalars().all()
    data = []
    for c in complaints:
        geom = to_shape(c.location)
        srid = c.location.srid
        status_list = [{
            "id": s.id,
            "complaint_id": s.complaint_id,
            "name": s.status.status_name,
            "description": s.status.description,
            "date": s.date.isoformat(),
            "time": s.time.strftime("%H:%M %p"),
        } for s in c.status_updates]
        if isinstance(geom, Point):
            complaint = {
                "id": c.id,
                "subject": c.subject,
                "description": c.description,
                "village": c.village,
                "municipality": c.municipality,
                "location": {
                    "latitude": geom.y,
                    "longitude": geom.x,
                    "srid": srid},
                "status": status_list}
        data.append(complaint)
    return data