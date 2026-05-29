from ..model.events import Events
from .get import GetEventServices
from ..schema.requests import AgmaEventSetup
from ..model.events_schedules import EventsSchedules
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy import select
from fastapi import Depends, HTTPException, status
from pprint import pprint
from datetime import date
from ..schema.requests import ScheduleEvent
from typing import List
import re

class PostEventServices:
    def __init__(self, get_services:GetEventServices = Depends(GetEventServices)):
        self.session = get_services.session
        self.get_services = get_services
    async def agma_event_schedule(self,schedules:List[ScheduleEvent]):
        agma_id = (await self.session.execute(select(Events.id).where(Events.title.ilike("%AGMA%")))).scalar_one()
        try:
            for sched in schedules:
                dump_model = sched.model_dump(mode="python")
                dump_model['event_id'] = agma_id
                if not sched.id:
                    dump_model.pop("id",None)
                    stmt = insert(EventsSchedules).values(**dump_model)
                    await self.session.execute(stmt)
                    await self.session.commit()
                else:
                    insert_stmt = insert(EventsSchedules).values(**dump_model)
                    upsert_stmt = insert_stmt.on_conflict_do_update(
                        index_elements=[EventsSchedules.id],
                        set_={
                            EventsSchedules.area : insert_stmt.excluded.area,
                            EventsSchedules.event_location: insert_stmt.excluded.event_location,
                            EventsSchedules.event_date: insert_stmt.excluded.event_date,
                        })
                    await self.session.execute(upsert_stmt)
                    await self.session.commit()
            return (await self.get_services.getAgmaEventsSchedule())
        except Exception as e:
            print(e)
            raise HTTPException(status_code=status.HTTP_304_NOT_MODIFIED, detail=str(e))
        return "success"
    
    
        
