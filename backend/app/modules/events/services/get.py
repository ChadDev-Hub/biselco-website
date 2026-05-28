from fastapi import Depends, status, HTTPException
from ....dependencies.db_session import get_session
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime, date
from ..model.events import Events
from sqlalchemy import select, and_, func
from ..schema.response import AgmaEvent, AbrevationStyle
from ..model.events_schedules import EventsSchedules
from datetime import date, datetime


class GetEventServices:
    def __init__(self, session: AsyncSession = Depends(get_session)):
        self.session = session
        self.date_time_now = func.date_trunc('minutes', func.current_timestamp())

    async def getAgmaEvents(self):
        try:
            stmt = select(Events).where(
                and_(Events.title.ilike("%AGMA%"), 
                     self.date_time_now.between(Events.start_date + Events.start_time,Events.end_date + Events.end_time)
                     ))
            result = (await self.session.execute(stmt)).scalars().one()
            dt = datetime.combine(result.end_date, result.end_time)
            return AgmaEvent(
                id=result.id,
                title=result.title,
                description=result.description,
                date_end=((dt.timestamp())*1000),
                qoute_title="Beyond Power.",
                qoute_description="Electric Cooperative Empowering Communities, Changing Lives.",
                footer="Makiisa, Makilahok, Manalo, Magkaisa sa AGMA!",
                image_src="/agma_image.jpg",
                start_date=result.start_date,
                end_date=result.end_date,
                start_time=result.start_time,
                end_time=result.end_time,
                is_active=result.is_active,
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
            print(e)
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

    
    async def getAgmaEventsSchedule(self):
        try:
            # check if there is an active agma schedule or not
            agma_event = (await self.session.execute(select(Events.id).where(
                and_(
                    Events.title == 'AGMA',
                    self.date_time_now.between(Events.start_date + Events.start_time, Events.end_date + Events.end_time))))).scalar_one_or_none()
            if not agma_event:
                raise HTTPException(
                    status_code = status.HTTP_404_NOT_FOUND,
                    detail = "There is no active AGMA Schedule"
                )
            stmt = select(EventsSchedules).where(EventsSchedules.event_id == agma_event)
            result = (await self.session.execute(stmt)).scalars().all()
            return result
        except Exception as e:
            print(e)
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail=str(e))