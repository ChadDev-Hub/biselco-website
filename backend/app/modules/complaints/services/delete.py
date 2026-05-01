from sqlalchemy import select, delete, and_
from fastapi import HTTPException, status, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from ....dependencies.db_session import get_session
from .get2 import GetServices
from .put import PutServices
from typing import Optional
from ..model.status_update import ComplaintsStatusUpdates
from ..schema.requests_model import Datahistory
class DeleteServices:
    def __init__(self,get_services:GetServices = Depends(GetServices), put_services:PutServices = Depends(PutServices)):
        self.session = get_services.session
        self.get_services = get_services
        self.put_services = put_services
        
    async def delete_complaint_status(self,user_id:str, complaint_id:int, status_id:int, current_status_id:Optional[int] = None):        
        try:
            selected_status = await self.get_services.get_seleted_status_name(status_id=status_id, to_delete=True, current_status_id=current_status_id)
            selected_complaints = await self.get_services.get_selected_complaints(complaints_id=complaint_id)
        
            # DELETE THE STATUS
            stmt = (delete(ComplaintsStatusUpdates)
                    .where(and_(ComplaintsStatusUpdates.complaint_id == selected_complaints.id, 
                    ComplaintsStatusUpdates.status_id.in_([s.id for s in selected_status]))))
            await self.session.execute(stmt)
            await self.session.commit()
            
            # ADD NEW STATUS HISTORY
            data = [
                Datahistory(
                    complaint_id=complaint_id, 
                    status_id=s.id, 
                    user_id=str(user_id),
                    comments=f"Removed From {s.status_name}").model_dump(mode="python")
                for  s in selected_status]
            await self.put_services.add_complaints_history(data=data)
            
            # GET NEW STATUS
            new_complaints_status = await self.get_services.get_new_complaints_status(complaints_id=complaint_id)
            return new_complaints_status, selected_complaints
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
        
        