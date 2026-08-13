from fastapi import HTTPException, status, Depends, Body
from sqlalchemy import delete, update, func
from sqlalchemy.ext.asyncio import AsyncSession
from ..model.change_meter import ChangeMeter, ChangeMeterImage
from fastapi import HTTPException, status, Depends, Body
from .....dependencies.db_session import get_session
from .get import get_change_meter
from typing import Optional



class DeleteServices:
    def __init__(self, session:AsyncSession = Depends(get_session)):
        self.session = session
    
    async def deleteChangeMeter(self,items: set, page: Optional[int] = None):
        try:
            stmt = update(ChangeMeter).where(ChangeMeter.id.in_(items)).values(
                is_deleted = True,
                datetime_deleted = func.now()
            )
            await self.session.execute(stmt)
            await self.session.commit()
            return {
                "success":True
            }
        except Exception as e:
            await self.session.rollback()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

