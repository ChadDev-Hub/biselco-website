from sqlalchemy import select, desc, func
from sqlalchemy.ext.asyncio import AsyncSession
from ..model.complaints import Complaints
from pprint import pprint
from sqlalchemy.orm import selectinload
from ..schema.response_model import Location
from geoalchemy2.shape import to_shape
from shapely import Point
import pytz
from typing import Optional
from .get import format_timedelta
from math import ceil
# GET COMPLAINTS HISTORY INCLUDES DELETED COMPLAINTS

PAGESIZE = 10


async def get_complaints_history(session: AsyncSession, page: Optional[int] = None):
    stmt = (select(Complaints)
            .options(selectinload(Complaints.user))
            .order_by(desc(Complaints.timestamped))
            .limit(PAGESIZE)
            )
    if page:
        stmt = stmt.offset((page - 1) * PAGESIZE)
    data = (await session.execute(stmt)).scalars().all()
                    
    total_page = ceil((await session.execute(select(func.count(Complaints.id)))).scalars().one() / PAGESIZE)
    model = {
        "complaints": [{
            "id": d.id,
            "user_id": str(d.user_id),
            "first_name": d.user.first_name,
            "last_name": d.user.last_name,
            "user_photo": d.user.photo,
            "subject": d.subject,
            "description": d.description,
            "reference_pole": d.reference_pole,
            "date_time_submitted": d.timestamped.astimezone(pytz.timezone("Asia/Manila")).strftime("%Y-%m-%d | %I:%M %p"),
            "village": d.village,
            "municipality": d.municipality,
            "location": {
                "latitude": Point(to_shape(d.location).coords).y,
                "longitude": Point(to_shape(d.location).coords).x,
                "srid": d.location.srid
            },
            "resolution_time": format_timedelta(d.resolution_time) if d.resolution_time else None,
        }for d in data],
    "total_page": total_page
    }
    return model

# GET COMMON COMPLAINTS

async def get_top_10_complaints(session: AsyncSession):
# TOP 10 COMPLAINTS
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
        .limit(5)
    )
    data = (await session.execute(top_complaints)).scalars().all()
    return data

async def get_complaint_overtime(session: AsyncSession):
    stmt = (select(
        func.jsonb_build_object(
            'name', func.date(Complaints.timestamped),
            'value', func.count(Complaints.id)
                  
        ).label("data")
    ).where(Complaints.is_deleted == False)
    .group_by(func.date(Complaints.timestamped))
    .order_by(func.date(Complaints.timestamped)))
    data = (await session.execute(stmt)).scalars().all()
    return data