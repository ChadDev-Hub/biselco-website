from sqlalchemy import select
from ..model.consumer import ConsumerMeter
from .....dependencies.db_session import get_session
from fastapi import Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from ..schema.response_model import ConsumerVerification


class ConsumerMeterGetService:
    def __init__(self, session: AsyncSession = Depends(get_session)):
        self.session = session

    async def verfify_account_no(self, account_no: str) -> ConsumerVerification:

        stmt = select(ConsumerMeter).where(
            ConsumerMeter.account_no == account_no)
        data = (await self.session.execute(stmt)).scalar_one_or_none()
        if not data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Account not Found")
        return ConsumerVerification(account_no=data.account_no)
