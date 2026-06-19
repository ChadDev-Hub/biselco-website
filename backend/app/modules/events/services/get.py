from fastapi import Depends, status, HTTPException
from ....dependencies.db_session import get_session
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime, date
from ..model.events import Events
from sqlalchemy import select, and_, func
from ..schema.response import AgmaEvent, AbrevationStyle, EventSchedule
from ..model.events_schedules import EventsSchedules
from datetime import date, datetime
from sqlalchemy.exc import SQLAlchemyError
import pytz


class GetEventServices:
    def __init__(self, session: AsyncSession = Depends(get_session)):
        self.session = session
        self.tz = pytz.timezone('Asia/Manila')
        self.now = datetime.now(self.tz)

    async def getAgmaEvents(self):
        try:
            stmt = select(Events).where(
                and_(Events.title.ilike("%AGMA%")
                     ))
            result = (await self.session.execute(stmt)).scalars().one()
            end_date = self.tz.localize(
                datetime.combine(result.end_date, result.end_time))
            start_date = self.tz.localize(datetime.combine(
                result.start_date, result.start_time))
            return AgmaEvent(
                id=result.id,
                title=result.title,
                description=result.description,
                target_date=(start_date.timestamp()*1000 if start_date >
                             self.now else end_date.timestamp()*1000),
                is_active=False if start_date > self.now else True if end_date > self.now else False,
                qoute_title="BISELCO Power",
                qoute_description="Governance Stronger, Service Smarter, Future Brighter",
                footer="Makiisa, Makilahok, Manalo, Magkaisa sa AGMA!",
                image_src="/agma_image.jpg",
                abrevation=[
                    AbrevationStyle(
                        char="A",
                        color="text-red-600 "
                    ),
                    AbrevationStyle(
                        char="G",
                        color="text-blue-600 "
                    ),
                    AbrevationStyle(
                        char="M",
                        color="text-yellow-600 "
                    ),
                    AbrevationStyle(
                        char="A",
                        color="text-green-600 "
                    )
                ]
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Agma Registration Closed!!")

    async def VerifyAgmaEventActive(self):
        try:
            stmt = select(Events).where(
                Events.title.ilike("%AGMA%")
            )

            result = (await self.session.execute(stmt)).scalars().first()

            if not result:
                raise HTTPException(
                    status_code=404,
                    detail="Agma Registration Closed!!"
                )

            now = datetime.now(self.tz)

            start = self.tz.localize(
                datetime.combine(result.start_date, result.start_time)
            )

            end = self.tz.localize(
                datetime.combine(result.end_date, result.end_time)
            )

            if not (start <= now <= end):
                raise HTTPException(
                    status_code=404,
                    detail="Agma Registration Closed!!"
                )

            return True
        except SQLAlchemyError as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Database Error")

    async def getAgmaEventsSchedule(self):
        try:
            agma_events_id = (await self.session.execute(select(Events.id).where(Events.title.ilike("%AGMA%")))).scalars().one()
            stmt = select(EventsSchedules).where(
                EventsSchedules.event_id == agma_events_id)
            results = (await self.session.execute(stmt)).scalars().all()
            data = [{
                "id": str(result.id),
                "event_id": result.event_id,
                "area": result.area,
                "event_location": result.event_location,
                "event_date": result.event_date
            } for result in results]
            return data
        except Exception as e:
            print(e)
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

    async def get_agma_schedules(self):
        try:
            is_agam_event_available = await self.VerifyAgmaEventActive()
            print(is_agam_event_available)
            agmaEvent = await self.getAgmaEventsSchedule()
            result = [{
                "id": scheds.get("id"),
                "area": scheds.get("area"),
                "date": scheds.get("event_date").strftime("%a, %b %d, %Y") if scheds.get("event_date") else None,
                "time": scheds.get("event_date").strftime("%I:%M %p") if scheds.get("event_date") else None,
                "location": scheds.get("event_location"),
                "image": f"/{scheds.get('area').split(' ')[-1].lower()}.jpg" if scheds.get("area") else None
            } for scheds in agmaEvent]

            return result
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
