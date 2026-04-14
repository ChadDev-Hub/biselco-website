from sqlalchemy import select, desc, func
from sqlalchemy.ext.asyncio import AsyncSession
from ..model.complaints import Complaints
from pprint import pprint
from sqlalchemy.orm import selectinload
from ..schema.response_model import ComplaintHistoryModel, Location
from geoalchemy2.shape import to_shape
from shapely import Point
import pytz
from typing import Optional
from .get_complaints import format_timedelta
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
