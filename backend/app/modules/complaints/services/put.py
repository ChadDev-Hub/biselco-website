from sqlalchemy import select, insert
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from ....dependencies.db_session import get_session
from fastapi import HTTPException, status, Depends
from ..model.complaints import Complaints
from ..model.status_update import ComplaintsStatusUpdates
from ..model.complaints_history import ComplaintsStatusHistory
from ..model.status_name import ComplaintsStatusName
from sqlalchemy.orm import selectinload
from typing import Optional
from ..schema.requests_model import Datahistory
from .get2 import GetServices
from typing import Literal, List


class PutServices:
    def __init__(self, session: AsyncSession = Depends(get_session), get_services:GetServices = Depends(GetServices)):
        self.session = session
        self.get_services = get_services
        
    async def add_new_status(self, complaints_id:int, stats:int, current_status_id:Optional[int] = None):
        """
        Add New Status to Complaints
        Args:
            complaints_id (int): complaint id
            stats (str): status name such as Received,Pending, Working,Complete
        """
        
        complaints = await self.get_services.get_selected_complaints(complaints_id=complaints_id)
        selected_status = await self.get_services.get_seleted_status_name(status_id=stats,current_status_id=current_status_id)
        
        added = False
        values = [
            {
                "complaint_id": complaints.id,
                "status_id": s.id
            }
            for s in selected_status
        ]
        try:
            new_status = (insert(ComplaintsStatusUpdates).values(values))
            await self.session.execute(new_status)
            await self.session.commit()
            added = True
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
        return added, selected_status, complaints
    
    async def add_complaints_history(self, data:List[dict]):
        added = False
        try:
            new_status_history = insert(ComplaintsStatusHistory).values(data)
            await self.session.execute(new_status_history)
            await self.session.commit()
            added = True
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
        return added
    
        
        
        