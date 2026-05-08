from sqlalchemy import select, func, cast, and_, Date, extract
from sqlalchemy.ext.asyncio import AsyncSession
from ....dependencies.db_session import get_session
from ..model.agma_registration import AgmaRegistration
from fastapi import Depends, HTTPException, status
from datetime import date




class GetAgmaRegistrationService:
    def __init__(self, session: AsyncSession = Depends(get_session)):
        self.session = session
        self.year_now = date.today().year
        
    async def verify_registration(self, account_no:str) -> bool:
        try:
            stmt = (select(AgmaRegistration)
                    .where(
                        and_(extract("year", cast(AgmaRegistration.timestamped, Date)) == self.year_now, AgmaRegistration.account_no == account_no)))
            data = (await self.session.execute(stmt)).scalar_one_or_none()
            if not data:
                return False
            return True
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))