from ..model.events import Events
from .get import GetEventServices
from ..model.events_schedules import EventsSchedules
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy import select
from fastapi import Depends, HTTPException, status
from ..schema.requests import ScheduleEvent
from typing import List
from ..schema.response import EventSchedule
from sqlalchemy.exc import NoResultFound
from ....core.redis import redis_client, CHANNEL
from uuid import uuid4
from ...user.service.get_user import GetUserServices
import json
class PostEventServices:
    def __init__(self, get_services:GetEventServices = Depends(GetEventServices), get_user:GetUserServices = Depends(GetUserServices)):
        self.session = get_services.session
        self.get_services = get_services
        self.event_id = uuid4()
        self.get_user = get_user
    async def agma_event_schedule(self,schedules:List[ScheduleEvent]):
        try:
            agma_id = (await self.session.execute(select(Events.id).where(Events.title.ilike("%AGMA%")))).scalar_one()
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
                            EventsSchedules.event_id: insert_stmt.excluded.event_id,
                            EventsSchedules.area : insert_stmt.excluded.area,
                            EventsSchedules.event_location: insert_stmt.excluded.event_location,
                            EventsSchedules.event_date: insert_stmt.excluded.event_date,
                        })
                    await self.session.execute(upsert_stmt)
                    await self.session.commit()
            new_agma_schedules = (await self.get_services.getAgmaEventsSchedule())
            admins = await self.get_user.get_users_by_roles(roles="admin")
            print(admins    )
            data = {
                "detail": "agma_scheds",
                "event_id": str(self.event_id),
                "message": "new_agma_event",
                "data" : [EventSchedule(**scheds).model_dump(mode="json") for scheds in new_agma_schedules],
            }
          
            payload = {
                "type": "admins",
                "user_ids": admins,
                "data": data,
            }
            await redis_client.publish(CHANNEL, json.dumps(payload))
            return {
                "message": "You have successfully updated the Agma Schedule",
            }
        except NoResultFound:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Setup Agma Event First")  
        except Exception as e:
            print(e)
            raise HTTPException(status_code=status.HTTP_304_NOT_MODIFIED, detail=str(e))
    
    
        
