from sqlalchemy import select, func, cast, and_, Date, extract
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from ....dependencies.db_session import get_session
from ..model.agma_registration import AgmaRegistration
from ...gis.consumer.model.consumer import ConsumerMeter
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
        
    async def get_registered(self, id:str):
         stmt = (select(AgmaRegistration)
                 .options(selectinload(AgmaRegistration.consumer)
                          .selectinload(ConsumerMeter.village),
                          selectinload(AgmaRegistration.consumer)
                          .selectinload(ConsumerMeter.municipal))
                    .where(AgmaRegistration.id == id))
         d = (await self.session.execute(stmt)).scalars().one()
         return {
             "account_no": d.account_no,
             "name": d.name,
             "phone": d.phone,
             "image": d.image,
             "signature": d.signature,
             "account_name": d.consumer.account_name,
             "village": d.consumer.village.name,
             "municipality": d.consumer.municipal.name,
             "meter_no": d.consumer.meter_no,
             "meter_brand": d.consumer.meter_brand
         }