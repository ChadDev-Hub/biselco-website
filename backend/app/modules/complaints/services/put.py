from sqlalchemy import select, insert
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from ....dependencies.db_session import get_session
from fastapi import HTTPException, status, Depends
from ..model.complaints import Complaints
from ..model.status_update import ComplaintsStatusUpdates
from ..model.complaints_history import ComplaintsStatusHistory
from ..model.status_name import ComplaintsStatusName
from typing import Optional
from ..schema.requests_model import Datahistory
from .get2 import GetServices
from typing import Literal


class PutServices:
    def __init__(self, session: AsyncSession = Depends(get_session), get_services:GetServices = Depends(GetServices)):
        self.session = session
        self.get_services = get_services
        
    async def add_new_status(self, complaints_id:int, stats:Literal['Received', 'Pending', 'Working', 'Complete'] | str):
        """
        Add New Status to Complaints
        Args:
            complaints_id (int): complaint id
            stats (str): status name such as Received,Pending, Working,Complete
        """
        
        complaints = await self.get_services.get_selected_complaints(complaints_id=complaints_id)
        status_name = await self.get_services.get_seleted_status_name(statu_name=stats)
        
        
        added = False
        try:
            new_status = ComplaintsStatusUpdates(complaints=complaints, status=status_name)
            self.session.add(new_status)
            await self.session.commit()
            added = True
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
        return added, status_name, complaints
    
    async def add_complaints_history(self, data:Datahistory):
        added = False
        try:
            new_status_history = insert(ComplaintsStatusHistory).values(data.model_dump(mode="python"))
            await self.session.execute(new_status_history)
            await self.session.commit()
            added = True
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
        return added
    
        
        
        