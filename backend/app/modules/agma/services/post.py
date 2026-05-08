from sqlalchemy import insert
from fastapi import HTTPException, status, Depends, Form
from sqlalchemy.ext.asyncio import AsyncSession
from ....dependencies.db_session import get_session
from ..model.agma_registration import AgmaRegistration
from ...gis.consumer.services.get import ConsumerMeterGetService
from ..services.get import GetAgmaRegistrationService
from ..schema.request_model import AgmaValidationRequest

class PostAgmaRegistrationService:
    def __init__(self,
                 consumer_meter_service: ConsumerMeterGetService = Depends(
                     ConsumerMeterGetService),
                 get_agma_registration_service: GetAgmaRegistrationService = Depends(
                     GetAgmaRegistrationService),
                 ):
        self.session = consumer_meter_service.session
        self.consumer_meter_service = consumer_meter_service
        self.get_agma_registration_service = get_agma_registration_service

    async def register_agma(self, data:AgmaValidationRequest):
        verified_account_no = await self.consumer_meter_service.verfify_account_no(account_no=data.account_no)
        if verified_account_no: 
            is_registered  = await self.get_agma_registration_service.verify_registration(verified_account_no.account_no)
            if is_registered:
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Already Registered")
            else:
                stmt = insert(AgmaRegistration).values(
                    account_no=data.account_no,
                    name = data.name,
                    phone = data.mobile_no,
                    image = data.image_url,
                    signature = data.signature_url
                    )
                await self.session.execute(stmt)
                await self.session.commit()
                return {"message": "Registered Successfully"}
