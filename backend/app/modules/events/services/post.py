from ..model.events import Events
from .get import GetEventServices
from ..schema.requests import AgmaEventSetup
from sqlalchemy.dialects.postgresql import insert
from fastapi import Depends, HTTPException, status
from pprint import pprint
from datetime import date
import re

class PostEventServices:
    def __init__(self, get_services:GetEventServices = Depends(GetEventServices)):
        self.session = get_services.session
    
    
    
    async def setup_agma_event(self,data:AgmaEventSetup):
        try:
            print(data)
            insert_stmt = insert(Events).values(data.model_dump(mode="python"))
            
            stmt = insert_stmt.on_conflict_do_update(index_elements=[Events.title],set_={
                Events.start_date:insert_stmt.excluded.start_date,
                Events.end_date:insert_stmt.excluded.end_date,
                Events.start_time:insert_stmt.excluded.start_time,
                Events.end_time:insert_stmt.excluded.end_time
            })
            await self.session.execute(stmt)
            await self.session.commit()
            return {"message": "success"}
        except Exception as e:
            pprint(e)
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
        
        
