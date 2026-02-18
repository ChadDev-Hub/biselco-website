from sqlalchemy.ext.asyncio.session import AsyncSession
from fastapi import status
from fastapi.exceptions import HTTPException
from sqlalchemy import select, and_, desc, asc
from sqlalchemy.orm import selectinload
from ..modules.complaints import *
from shapely.geometry import Point
from geoalchemy2.shape import to_shape
from uuid import UUID
async def complaints(session:AsyncSession):
    complaints = (await session.execute(
        select(Complaints)
        .options(selectinload(Complaints.status_updates)
                 .selectinload(ComplaintsStatusUpdates.status))
        .options(selectinload(Complaints.user))
        .order_by(desc(Complaints.time_stamped))
    )).scalars().all()
    data = []
    for c in complaints:
        geom = Point(to_shape(c.location).coords)
        srid = c.location.srid
        status_list = [{
            "id": s.id,
            "complaint_id": s.complaint_id,
            "status_id": s.status_id,
            "name": s.status.status_name,
            "description": s.status.description,
            "date": s.date.isoformat(),
            "time": s.time.strftime("%I:%M %p"),
        } for s in c.status_updates]
        data.append({
            "id": c.id,
            "user_id": str(c.user_id),
            "first_name": c.user.first_name,
            "last_name": c.user.last_name,
            "subject": c.subject,
            "description": c.description,
            "village": c.village,
            "municipality": c.municipality,
            "location": {
                "latitude": geom.y,
                "longitude": geom.x,
                "srid": srid
            },
            "status": status_list
        })
    return data

# NEW COMPLAINT
async def new_complaint(session:AsyncSession, complaint_id:int, user_id:UUID):
    n_complaint = await session.scalar(
    select(Complaints)
    .options(
        selectinload(Complaints.status_updates)
        .selectinload(ComplaintsStatusUpdates.status)
    )
    .options(selectinload(Complaints.user))
    .order_by(desc(Complaints.time_stamped))
    .where(and_(Complaints.id == complaint_id, Complaints.user_id == user_id))
    )
    if not n_complaint:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Complaint Not Found")
    # GET STATUS
    status_list = [
    {
        "id": s.id,
        "complaint_id": s.complaint_id,
        "status_id": s.status_id,
        "name": s.status.status_name,
        "description": s.status.description,
        "date": s.date.isoformat(),
        "time": s.time.strftime("%I:%M %p")
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
             "user_id": str(n_complaint.user_id),
             "first_name" : n_complaint.user.first_name,
             "last_name" : n_complaint.user.last_name,
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
        .options(selectinload(Complaints.user))
        .where(Complaints.user_id == user_id)
        .order_by(desc(Complaints.time_stamped))
    )).scalars().all()
    data = []
    for c in complaints:
        geom = to_shape(c.location)
        srid = c.location.srid
        status_list = [{
            "id": s.id,
            "complaint_id": s.complaint_id,
            "status_id": str(s.status_id),
            "name": s.status.status_name,
            "description": s.status.description,
            "date": s.date.isoformat(),
            "time": s.time.strftime("%I:%M %p"),
        } for s in c.status_updates]
        if isinstance(geom, Point):
            complaint = {
                "id": c.id,
                "user_id": c.user_id,
                "first_name": c.user.first_name,
                "last_name": c.user.last_name,
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


# GET NEW COMPLAINTS ALL USERS STATUS
async def new_complaints_status(session:AsyncSession, complaint_id):
    new_complaint_status = (await session.execute(
        select(Complaints)
        .options(selectinload(Complaints.status_updates)
                 .selectinload(ComplaintsStatusUpdates.status))
        .options(selectinload(Complaints.user))
        .order_by(desc(Complaints.time_stamped))
        .where(Complaints.id == complaint_id))).scalar_one_or_none()
    if not new_complaint_status:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Complaint Not Found")
    status_list = [{
        "id": s.id,
        "complaint_id": s.complaint_id,
        "status_id": s.status_id,
        "name": s.status.status_name,
        "description": s.status.description,
        "date": s.date.isoformat(),
        "time": s.time.strftime("%I:%M %p"),
    } for s in new_complaint_status.status_updates]
    data = {
        "id": new_complaint_status.id,
        "user_id": str  (new_complaint_status.user_id),
        "first_name": new_complaint_status.user.first_name,
        "last_name": new_complaint_status.user.last_name,
        "subject": new_complaint_status.subject,
        "description": new_complaint_status.description,
        "village": new_complaint_status.village,
        "municipality": new_complaint_status.municipality,
        "location": {
            "latitude": Point(to_shape(new_complaint_status.location).coords).y,
            "longitude": Point(to_shape(new_complaint_status.location).coords).x,
            "srid": new_complaint_status.location.srid},
        "status": status_list
    }
    return data