from sqlalchemy import select, distinct, case, union_all, literal
from sqlalchemy.ext.asyncio.session import AsyncSession
from fastapi import status, Depends
from ....dependencies.db_session import get_session
from fastapi.exceptions import HTTPException
from sqlalchemy import select, and_,  or_, func,  desc
from sqlalchemy.orm import selectinload
from .. import *
from ...user import Users
from ...complaints import ComplaintsStatusUpdates, ComplaintsStatusName
from ..model.complaints_history import ComplaintsStatusHistory
from ..schema.response_model import ComplaintStatus, StatusHistory, ComplaintsModel, Location, NewComplaintStatus
from ....modules.websocket.schema.response_model import User, Message
from ....core.security import get_current_user
from shapely.geometry import Point
from geoalchemy2.shape import to_shape
from datetime import datetime
from uuid import UUID
from typing import Optional
from ...user.schema.response_model import UserModel
from ....common.total_page import get_total_page
import pytz



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
    if seconds > 0:
        parts.append(f"{seconds}s")
    return " ".join(parts) if parts else "0s"


class GetServices:
    def __init__(self, user:UserModel = Depends(get_current_user), page_size:int = 10, session: AsyncSession = Depends(get_session)):
        self.session = session
        self.user_id = user.id
        self.PAGESIZE = page_size
    def get_latest_status(self):
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
        return latest_status_name

    def get_unread_message(self):
        unread_message = (select(
            ComplaintsMessage.complaints_id,
            func.count(ComplaintsMessage.id).label("count"))
            .where(and_(ComplaintsMessage.receiver_status == "Unread", ComplaintsMessage.sender_id != self.user_id))
            .group_by(ComplaintsMessage.complaints_id)
            .cte("unread_messages")
        )
        return unread_message
    
    # GET SELECTED COMPLAINTS
    async def get_selected_complaints(self, complaints_id:int):
        selected_complaints = (await self.session.execute(select(Complaints).where(Complaints.id == complaints_id))).scalar_one_or_none()
        if not selected_complaints:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Complaint Not Found")
        return selected_complaints
    
    # GET SELECTED STATUS NAME
    async def get_seleted_status_name(self, statu_name:str):
        selected_status_name = (await self.session.execute(select(ComplaintsStatusName).where(ComplaintsStatusName.status_name == statu_name))).scalar_one_or_none()
        if not selected_status_name:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Status Not Found")
        return selected_status_name
    
    async def get_all_complaints(self, page: Optional[int] = None, query: Optional[str] = None, get_all:bool = True):
        if not page:
            page = 1
        latest_status_name = self.get_latest_status()
        unread_message = self.get_unread_message()
        stmt = (
            select(Complaints, 
                   latest_status_name.c.status_name.label("latest_status"),
                   unread_message.c.count.label("unread_messages"))
            .select_from(Complaints)
            .join(latest_status_name, latest_status_name.c.complaint_id == Complaints.id)
            .join(Users, Users.id == Complaints.user_id)
            .outerjoin(unread_message, unread_message.c.complaints_id == Complaints.id)
            .options(selectinload(Complaints.status_updates)
                     .selectinload(ComplaintsStatusUpdates.status),
                     selectinload(Complaints.user),
                     selectinload(Complaints.status_history)
                     .selectinload(ComplaintsStatusHistory.user),
                     selectinload(Complaints.complaints_image)
                     )
        ).order_by(desc(Complaints.id)).where(Complaints.is_deleted == False)
        if not get_all:
            stmt = stmt.where(Complaints.user_id == self.user_id)
        if query:
            page = 1
            stmt = stmt.where(or_(
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
            )).offset((page - 1) * self.PAGESIZE).limit(self.PAGESIZE)
        else:
            stmt = stmt.offset((page - 1) * self.PAGESIZE).limit(self.PAGESIZE)

        data = (await self.session.execute(stmt)).all()
        total_complaint = (await self.session.execute(select(func.count(Complaints.id)).where(Complaints.is_deleted == False))).scalar_one()
        total_page = total_complaint // self.PAGESIZE if total_complaint % self.PAGESIZE == 0 else total_complaint // self.PAGESIZE + 1
        results = []
        for complaints, latests_updates, unread_messages in data:
            status_lists = [
                ComplaintStatus(
                    id=s.id,
                    complaint_id=s.complaint_id,
                    status_id=s.status_id,
                    name=s.status.status_name,
                    description=s.status.description,
                    date=s.timestamped.astimezone(pytz.timezone("Asia/Manila")).strftime("%Y-%m-%d"),
                    time=s.timestamped.astimezone(pytz.timezone("Asia/Manila")).strftime("%I:%M %p"),
                    ) for s in complaints.status_updates]
            status_history = [
                StatusHistory(
                    id=s.id,
                    first_name=s.user.first_name,
                    last_name=s.user.last_name,
                    comments=s.comments,
                    timestamped=s.timestamped.astimezone(pytz.timezone("Asia/Manila")).strftime("%Y-%m-%d %I:%M %p"),
                    user_photo=s.user.photo,
                    ) for s in complaints.status_history]
            loc = Point(to_shape(complaints.location).coords)
            results.append(ComplaintsModel(
                id=complaints.id,
                user_id=str(complaints.user_id),
                first_name=complaints.user.first_name,
                last_name=complaints.user.last_name,
                user_photo=complaints.user.photo,
                subject=complaints.subject,
                description=complaints.description,
                reference_pole=complaints.reference_pole,
                village=complaints.village,
                municipality=complaints.municipality,
                location=Location(
                    latitude=loc.y,
                    longitude=loc.x,
                    srid=complaints.location.srid
                    ),
                date_time_submitted=complaints.timestamped.astimezone(pytz.timezone("Asia/Manila")).strftime("%Y-%m-%d %I:%M %p"),
                status=status_lists,
                latest_status=latests_updates,
                status_history=status_history,
                resolution_time=format_timedelta(complaints.resolution_time) if complaints.resolution_time else None,
                unread_messages=unread_messages
            ))
        return {
            "data": results,
            "total_page": total_page
        }
    async def get_new_complaints_status(self, complaints_id:int):
        latests_status = self.get_latest_status()
        stmt = (select(Complaints,latests_status.c.status_name.label("latest_status"))
                .select_from(Complaints)
                .outerjoin(latests_status, latests_status.c.complaint_id == Complaints.id)
                .options(selectinload(Complaints.status_updates)
                         .selectinload(ComplaintsStatusUpdates.status),
                         selectinload(Complaints.status_history)
                         .selectinload(ComplaintsStatusHistory.user)
                         )
                .where(and_(Complaints.is_deleted == False, Complaints.id == complaints_id))
                )
        new_complaints, latests_status = (await self.session.execute(stmt)).one()
        if not new_complaints:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="New Status Complaint Not Found")
        status_lists = [
            ComplaintStatus(
                id=s.id,
                complaint_id=s.complaint_id,
                status_id=s.status_id,
                name=s.status.status_name,
                description=s.status.description,
                date=s.timestamped.astimezone(pytz.timezone("Asia/Manila")).strftime("%Y-%m-%d"),
                time=s.timestamped.astimezone(pytz.timezone("Asia/Manila")).strftime("%I:%M %p"),
                ) for s in new_complaints.status_updates]
        status_history = [
            StatusHistory(
                id=s.id,
                first_name=s.user.first_name,
                last_name=s.user.last_name,
                comments=s.comments,
                timestamped=s.timestamped.astimezone(pytz.timezone("Asia/Manila")).strftime("%Y-%m-%d %I:%M %p"),
                user_photo=s.user.photo,
                ) for s in new_complaints.status_history]
        return NewComplaintStatus(
            complaint_id=new_complaints.id,
            status=status_lists,
            latest_status=latests_status,
            status_history=status_history
        ).model_dump(mode="json")
     

class GetDashboardServices:
    def __init__(self, session: AsyncSession = Depends(get_session)):
        self.session = session
    
    async def get_top_complaints(self):
        top_complaints = (
        select(
            func.jsonb_build_object(
                'name', Complaints.subject,
                'value', func.count(Complaints.id)
            ).label("top_complaints"),
            func.count(Complaints.id).label("total")
        ).select_from(Complaints)
        .where(Complaints.is_deleted == False)
        .group_by(Complaints.subject)
        .order_by(desc("total"))
        .limit(5))
        data = (await self.session.execute(top_complaints)).scalars().all()
        return data
    
    async def get_complaint_overtime(self):
        stmt = (select(
            func.jsonb_build_object(
                'name', func.date(Complaints.timestamped),
                'value', func.count(Complaints.id)
            ).label("data")
        ).where(Complaints.is_deleted == False)
        .group_by(func.date(Complaints.timestamped))
        .order_by(func.date(Complaints.timestamped)))
        data = (await self.session.execute(stmt)).scalars().all()
        return data
    
    async def get_complaints_stats(self):
        # TOTAL COMPLAINTS
        total_complaints = (
            select(
                func.jsonb_build_object(
                    'id', 1,
                    'title', 'Total Complaints',
                    'value', func.count(Complaints.id),
                    'description', 'Includes Deleted'
                ).label("data"))
            .select_from(Complaints)
        ).cte("total_complaints")

        # SUBQUERY FOR COMPLAINTS STATS
        complaints_subquery = (
            select(
                func.count(distinct(ComplaintsStatusUpdates.complaint_id))
                .label("total"),
                func.count(ComplaintsStatusUpdates.complaint_id).filter(
                    ComplaintsStatusUpdates.status_id == 4
                ).label("completed")).
            select_from(Complaints)
            .join(ComplaintsStatusUpdates, Complaints.id == ComplaintsStatusUpdates.complaint_id)
            .where(Complaints.is_deleted == False)
        ).subquery("complaints_subquery")

        # COMPLETED COMPLAINTS
        completed_complaints = (
            select(
                func.jsonb_build_object(
                    'id', 2,
                    'title', 'Completion',
                    'value', complaints_subquery.c.completed,
                    'description',

                    func.concat(
                        case(
                            (func.round(
                                (complaints_subquery.c.completed / func.nullif(complaints_subquery.c.total,0)) * 100, 2) > 50, "📈"),
                            else_="📉"),
                        complaints_subquery.c.total,
                        ' ',

                        '(',
                        func.round(
                            (complaints_subquery.c.completed / func.nullif(complaints_subquery.c.total,0)) * 100, 2),
                        '%',
                        ')')
                ).label("data"))
            .select_from(complaints_subquery)
        ).cte("completed_complaints")

        # DAILY COMPLAINTS
        daily_complaints = (
            select(
                func.jsonb_build_object(
                    'id', 3,
                    'title', 'Daily Complaints',
                    'value', func.count(Complaints.id),
                    'description', 'Today'
                ).label("data"))
            .select_from(Complaints)
            .where(and_(Complaints.is_deleted == False,(func.date(Complaints.timestamped) == func.current_date())))
        ).cte("daily_complaints")

        

        # UNION ALL CTE
        cte_union = (
            union_all(
                select(literal(1).label("id"), total_complaints.c.data),
                select(literal(2).label("id"), completed_complaints.c.data),
                select(literal(3).label("id"), daily_complaints.c.data)
            ).order_by("id")
        ).subquery("cte_union")

        # STATS DATA
        stats_data = select(
            select(
                func.json_agg(cte_union.c.data).label("data"),
            ).scalar_subquery().label("data")
        )

        data = (await self.session.execute(stats_data)).scalar()
        return data
    
class GetMessageServices:
    def __init__(self, session: AsyncSession = Depends(get_session)):
        self.session = session
    
    async def get_message(self, complaints_id: int):
        message = (await self.session.execute(select(ComplaintsMessage)
                                        .options(selectinload(ComplaintsMessage.sender), selectinload(ComplaintsMessage.receiver))
                                        .where(ComplaintsMessage.complaints_id == complaints_id)
                                        .order_by(ComplaintsMessage.timestamped))).scalars().all()
        data = [

            Message(
                id=str(m.id),
                complaints_id=m.complaints_id,
                sender=User(id=str(m.sender.id), first_name=m.sender.first_name,
                            last_name=m.sender.last_name, photo=m.sender.photo),
                receiver=User(id=str(m.receiver.id) if m.receiver else None,
                            first_name=m.receiver.first_name if m.receiver else None,
                            last_name=m.receiver.last_name if m.receiver else None,
                            photo=m.receiver.photo) if m.receiver else None,
                sender_status=m.sender_status,
                receiver_status=m.receiver_status,
                message=m.message,
                date=m.timestamped.astimezone(pytz.timezone('Asia/Manila')).strftime("%Y-%m-%d"),
                time=m.timestamped.astimezone(pytz.timezone('Asia/Manila')).strftime("%I:%M %p"),
            )
            for m in message
        ]
    
        return data

