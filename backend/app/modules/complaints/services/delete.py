from sqlalchemy import select
from fastapi import HTTPException, status, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from ....dependencies.db_session import get_session


class DeleteServices:
    def __init__(self,session:AsyncSession = Depends(get_session)):
        self.session = session
    
    async def delete_complaint_status(self)