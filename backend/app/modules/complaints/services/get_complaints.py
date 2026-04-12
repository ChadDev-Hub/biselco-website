from sqlalchemy.ext.asyncio.session import AsyncSession
from sqlalchemy.sql.operators import ilike_op
from fastapi import status
from fastapi.exceptions import HTTPException
from sqlalchemy import select, and_, desc, or_, func, cast, Text, Date, Time
from sqlalchemy.orm import selectinload
from .. import *
from ...user import Users
from ...complaints import ComplaintsStatusUpdates, ComplaintsStatusName
from ..model.complaints_history import ComplaintsStatusHistory
from shapely.geometry import Point
from geoalchemy2.shape import to_shape
from datetime import datetime
from uuid import UUID
from typing import Optional
import pytz
from ....modules.websocket.schema.response_model import User, Message
from pprint import pprint
PAGESIZE = 10


def format_timedelta(td):
    total_seconds = int(td.total_seconds())

    days, remainder = divmod(total_seconds, 86400)  # 1 day = 86400s
    hours, remainder = divmod(remainder, 3600)
    minutes, seconds = divmod(remainder, 60)

    parts = []

    if days > 0:
        parts.append(f"{days}d")
    if hours > 0:
        parts.append(f"{hours}h")
    if minutes > 0:
        parts.append(f"{minutes}m")

    return " ".join(parts) if parts else "0m"




# GET ALL COMPLAINTS
async def complaints(session: AsyncSession, query: Optional[str] = None, page: Optional[int]=None):
    if page is None:
        page = 1
    latest_status = (
        select(
            ComplaintsStatusUpdates.complaint_id,
            func.max(ComplaintsStatusUpdates.status_id).label("status_id"))
        .group_by(ComplaintsStatusUpdates.complaint_id)
        .cte("latest_status")
    )
    latest_status_name = (
        select(
            latest_status.c.complaint_id.label("complaint_id"),
            ComplaintsStatusName.status_name)
        .select_from(latest_status)
        .join(ComplaintsStatusName, ComplaintsStatusName.id == latest_status.c.status_id)
        .cte("latest_status_name")
    )
    
    unread_messages = (
        select(
            ComplaintsMessage.complaints_id,
            func.count(ComplaintsMessage.id).label("count"  
        ))
        .where(ComplaintsMessage.receiver_status == "Unread")
        .group_by(ComplaintsMessage.complaints_id)
        .cte("unread_messages")
        )
    complaints = (
        select(Complaints,
               latest_status_name.c.status_name,
               unread_messages.c.count,
               func.ceil(func.row_number().over(
                   order_by=Complaints.id.desc())/PAGESIZE).label("page")
               )
        .select_from(Complaints)
        .join(latest_status_name, latest_status_name.c.complaint_id == Complaints.id, isouter=True)
        .join(Users, Users.id == Complaints.user_id)
        .outerjoin(unread_messages, unread_messages.c.complaints_id == Complaints.id)
        .options(
            selectinload(Complaints.status_updates)
            .selectinload(ComplaintsStatusUpdates.status),
            selectinload(Complaints.user),
            selectinload(Complaints.status_history).
            selectinload(ComplaintsStatusHistory.user)
        )
        .order_by(Complaints.id.desc())
        .where(Complaints.is_deleted == False)
    )
    if query:
        stmt = complaints.where(or_(
            func.to_char(Complaints.timestamped,
                         "YYYY-MM-DD").ilike(f"%{query}%"),
            func.to_char(Complaints.timestamped,
                         "HH12:MI AM").ilike(f"%{query}%"),
            Complaints.subject.ilike(f"%{query}%"),
            Complaints.description.ilike(f"%{query}%"),
            Complaints.village.ilike(f"%{query}%"),
            Complaints.municipality.ilike(f"%{query}%"),
            Users.first_name.ilike(f"%{query}%"),
            Users.last_name.ilike(f"%{query}%"),
            Users.email.ilike(f"%{query}%"),
            latest_status_name.c.status_name.ilike(f"%{query}%"),
        )).offset((PAGESIZE * (page - 1))).limit(PAGESIZE)
    else:
        stmt = complaints.offset((PAGESIZE * (page - 1))).limit(PAGESIZE)
    data = (await session.execute(stmt)).unique().all()
    total_page = (len(data) // PAGESIZE) + 1
    results = []
    for complaints, latest_status,unread_messages, page in data:
        status_list = [{
            "id": s.id,
            "complaint_id": s.complaint_id,
            "status_id": s.status_id,
            "name": s.status.status_name,
            "description": s.status.description,
            "date": s.timestamped.astimezone(pytz.timezone("Asia/Manila")).strftime("%Y-%m-%d"),
            "time": s.timestamped.astimezone(pytz.timezone("Asia/Manila")).strftime("%I:%M %p"),
        } for s in complaints.status_updates]
        status_history = [{
            "id": sh.id,
            "first_name": sh.user.first_name,
            "last_name": sh.user.last_name,
            "user_photo": sh.user.photo,
            "comments": sh.comments,
            "timestamped": sh.timestamped.astimezone(pytz.timezone("Asia/Manila")).strftime("%Y-%m-%d | %I:%M %p"),
        } for sh in complaints.status_history]
        
        complaints_data = {
            "id": complaints.id,
            "user_id": str(complaints.user_id),
            "first_name": complaints.user.first_name,
            "last_name": complaints.user.last_name,
            "user_photo": complaints.user.photo,
            "subject": complaints.subject,
            "description": complaints.description,
            "reference_pole": complaints.reference_pole,
            "date_time_submitted": complaints.timestamped.astimezone(pytz.timezone("Asia/Manila")).strftime("%Y-%m-%d | %I:%M %p"),
            "village": complaints.village,
            "municipality": complaints.municipality,
            "location": {
                'latitude': Point(to_shape(complaints.location).coords).y,
                'longitude': Point(to_shape(complaints.location).coords).x,
                'srid': complaints.location.srid
            },
            "status": status_list,
            "latest_status": latest_status,
            "status_history": status_history,
            "resolution_time": format_timedelta(complaints.resolution_time) if complaints.resolution_time else None,
            "unread_messages": unread_messages
        }
        
        results.append(complaints_data)
    return {
        "data": results,
        "total_page": total_page
    }


# NEW COMPLAINT
async def new_complaint(session: AsyncSession, complaint_id: int):
    latests_status = (select(ComplaintsStatusUpdates.complaint_id,
                             func.max(ComplaintsStatusUpdates.status_id).label(
                                 "status_id")
                             )
                      .where(ComplaintsStatusUpdates.complaint_id == complaint_id)
                      .group_by(ComplaintsStatusUpdates.complaint_id)
                      .cte("latest_status"))

    latest_statu_name = (select(latests_status.c.complaint_id, ComplaintsStatusName.status_name)
                         .select_from(latests_status)
                         .join(ComplaintsStatusName, ComplaintsStatusName.id == latests_status.c.status_id)
                         .cte("latest_status_name"))
    
    unread_messages = (
        select(
            ComplaintsMessage.complaints_id,
            func.count(ComplaintsMessage.id).label("count"  
        ))
        .where(and_(ComplaintsMessage.receiver_status == "Unread", ComplaintsMessage.complaints_id == complaint_id))
        .group_by(ComplaintsMessage.complaints_id)
        .cte("unread_messages")
        )

    stmt = (select(Complaints, latest_statu_name.c.status_name.label("latest_status"),unread_messages.c.count)
            .select_from(Complaints)
            .join(latest_statu_name, latest_statu_name.c.complaint_id == Complaints.id)
            .outerjoin(unread_messages, unread_messages.c.complaints_id == Complaints.id)
            .options(selectinload(Complaints.status_updates)
                     .selectinload(ComplaintsStatusUpdates.status),
                     selectinload(Complaints.user),
                     selectinload(Complaints.status_history)
                     .selectinload(ComplaintsStatusHistory.user),)
            .where(Complaints.is_deleted == False)
            )

    row = (await (session.execute(stmt))).one_or_none()
    
    if not row:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Complaint Not Found")

    n_complaint, latests_status, unread_messages = row
    if not n_complaint:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Complaint Not Found")
    # GET STATUS
    status_list = [
        {
            "id": s.id,
            "complaint_id": s.complaint_id,
            "status_id": s.status_id,
            "name": s.status.status_name,
            "description": s.status.description,
            "date": s.timestamped.astimezone(pytz.timezone("Asia/Manila")).strftime("%Y-%m-%d"),
            "time": s.timestamped.astimezone(pytz.timezone("Asia/Manila")).strftime("%I:%M %p"),
        }
        for s in n_complaint.status_updates
    ]
    
    status_history = [{
        "id": sh.id,
        "first_name": sh.user.first_name,
        "last_name": sh.user.last_name,
        "user_photo": sh.user.photo,
        "comments": sh.comments,
        "timestamped": sh.timestamped.astimezone(pytz.timezone("Asia/Manila")).strftime("%Y-%m-%d | %I:%M %p"),
    } for sh in n_complaint.status_history]
 
    # PROCESS GEOMETRY WBKELEMENTS
    data = {
        "id": n_complaint.id,
        "user_id": str(n_complaint.user_id),
        "first_name": n_complaint.user.first_name,
        "last_name": n_complaint.user.last_name,
        "user_photo": n_complaint.user.photo,
        "subject": n_complaint.subject,
        "description": n_complaint.description,
        "reference_pole": n_complaint.reference_pole,
        "date_time_submitted": n_complaint.timestamped.astimezone(pytz.timezone("Asia/Manila")).strftime("%Y-%m-%d | %I:%M %p"),
        "village": n_complaint.village,
        "municipality": n_complaint.municipality,
        "location": {
            'latitude': Point(to_shape(n_complaint.location).coords).y,
            'longitude': Point(to_shape(n_complaint.location).coords).x,
            'srid': n_complaint.location.srid},
        "status": status_list,
        "status_history": status_history,
        "latest_status": latests_status,
        "resolution_time": format_timedelta(n_complaint.resolution_time) if n_complaint.resolution_time else None,
        "unread_messages": unread_messages
        
    }
    await session.close()
    return data


# GET COMPLAINTS FOR SPECIFIC USER
async def user_complaints(session: AsyncSession, user_id: UUID):
    unread_messages = (
    select(
        ComplaintsMessage.complaints_id,
        func.count(ComplaintsMessage.id).label("count"  
    ))
    .where(ComplaintsMessage.receiver_status == "Unread")
    .group_by(ComplaintsMessage.complaints_id)
    .cte("unread_messages")
    )

    complaints = (await session.execute(
        select(Complaints, unread_messages.c.count)
        .outerjoin(unread_messages, unread_messages.c.complaints_id == Complaints.id)
        .options(selectinload(Complaints.status_updates)
                 .selectinload(ComplaintsStatusUpdates.status))
        .options(selectinload(Complaints.user))
        .where(and_(Complaints.user_id == user_id, Complaints.is_deleted == False))
        .order_by(desc(Complaints.timestamped))
    )).all()
    data = []
    for c, unread_messages in complaints:
        geom = to_shape(c.location)
        srid = c.location.srid
        status_list = [{
            "id": s.id,
            "complaint_id": s.complaint_id,
            "status_id": s.status_id,
            "name": s.status.status_name,
            "description": s.status.description,
            "date": s.timestamped.astimezone(pytz.timezone("Asia/Manila")).strftime("%Y-%m-%d"),
            "time": s.timestamped.astimezone(pytz.timezone("Asia/Manila")).strftime("%I:%M %p"),
        } for s in c.status_updates]
        if isinstance(geom, Point):
            complaint = {
                "id": c.id,
                "user_id": str(c.user_id),
                "first_name": c.user.first_name,
                "last_name": c.user.last_name,
                "user_photo": c.user.photo,
                "subject": c.subject,
                "description": c.description,
                "reference_pole": c.reference_pole,
                "date_time_submitted": c.timestamped.astimezone(pytz.timezone("Asia/Manila")).strftime("%Y-%m-%d | %I:%M %p"),
                "village": c.village,
                "municipality": c.municipality,
                "location": {
                    "latitude": geom.y,
                    "longitude": geom.x,
                    "srid": srid},
                "status": status_list,
                "resolution_time": format_timedelta(c.resolution_time) if c.resolution_time else None,
                "unread_messages": unread_messages,
                }
            if complaint:
                data.append(complaint)
    return data


# GET NEW COMPLAINTS ALL USERS STATUS
async def new_complaints_status(session: AsyncSession, complaint_id):
    latests_status = (select(ComplaintsStatusUpdates.complaint_id,
                             func.max(ComplaintsStatusUpdates.status_id).label(
                                 "status_id")
                             )
                      .where(ComplaintsStatusUpdates.complaint_id == complaint_id)
                      .group_by(ComplaintsStatusUpdates.complaint_id)
                      .cte("latest_status"))

    latest_statu_name = (select(latests_status.c.complaint_id, ComplaintsStatusName.status_name)
                         .select_from(latests_status)
                         .join(ComplaintsStatusName, ComplaintsStatusName.id == latests_status.c.status_id)
                         .cte("latest_status_name"))
    
    unread_messages = (
    select(
        ComplaintsMessage.complaints_id,
        func.count(ComplaintsMessage.id).label("count"  
    ))
    .where(ComplaintsMessage.receiver_status == "Unread")
    .group_by(ComplaintsMessage.complaints_id)
    .cte("unread_messages")
    )

    stmt = (select(Complaints, latest_statu_name.c.status_name.label("latest_status"), unread_messages.c.count)
            .select_from(Complaints)
            .join(latest_statu_name, latest_statu_name.c.complaint_id == Complaints.id)
            .outerjoin(unread_messages, unread_messages.c.complaints_id == Complaints.id)
            .options(selectinload(Complaints.status_updates)
                     .selectinload(ComplaintsStatusUpdates.status),
                     selectinload(Complaints.user),
                     selectinload(Complaints.status_history)
                     .selectinload(ComplaintsStatusHistory.user),
                     )
            )
    row = (await session.execute(stmt)).one_or_none()
    
    if not row:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Complaint Not Found")
    new_complaint_status, latest_stats, unread_messages = row
    
    if not new_complaint_status:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Complaint Not Found")

    status_list = [{
        "id": s.id,
        "complaint_id": s.complaint_id,
        "status_id": s.status_id,
        "name": s.status.status_name,
        "description": s.status.description,
        "date": s.timestamped.astimezone(pytz.timezone("Asia/Manila")).strftime("%Y-%m-%d"),
        "time": s.timestamped.astimezone(pytz.timezone("Asia/Manila")).strftime("%I:%M %p"),
    } for s in new_complaint_status.status_updates]
    status_history = [{
            "id": sh.id,
            "first_name": sh.user.first_name,
            "last_name": sh.user.last_name,
            "user_photo": sh.user.photo,
            "comments": sh.comments,
            "timestamped": sh.timestamped.astimezone(pytz.timezone("Asia/Manila")).strftime("%Y-%m-%d | %I:%M %p"),
        } for sh in new_complaint_status.status_history]
    data = {
        "id": new_complaint_status.id,
        "user_id": str(new_complaint_status.user_id),
        "first_name": new_complaint_status.user.first_name,
        "last_name": new_complaint_status.user.last_name,
        "user_photo": new_complaint_status.user.photo,
        "subject": new_complaint_status.subject,
        "description": new_complaint_status.description,
        "reference_pole": new_complaint_status.reference_pole,
        "date_time_submitted": new_complaint_status.timestamped.astimezone(pytz.timezone("Asia/Manila")).strftime("%Y-%m-%d | %I:%M %p"),
        "village": new_complaint_status.village,
        "municipality": new_complaint_status.municipality,
        "location": {
            "latitude": Point(to_shape(new_complaint_status.location).coords).y,
            "longitude": Point(to_shape(new_complaint_status.location).coords).x,
            "srid": new_complaint_status.location.srid},
        "status": status_list,
        "status_history": status_history,
        "latest_status": latest_stats,
        "resolution_time": format_timedelta(new_complaint_status.resolution_time) if new_complaint_status.resolution_time else None,
        "unread_messages": unread_messages
    }
    pprint(data)
    return data
