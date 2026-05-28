from sqlalchemy import insert
from fastapi import HTTPException, status, Depends, Form
from sqlalchemy.ext.asyncio import AsyncSession
from ....dependencies.db_session import get_session
from ..model.agma_registration import AgmaRegistration
from ...gis.consumer.services.get import ConsumerMeterGetService
from ..services.get import GetAgmaRegistrationService
from ..schema.request_model import AgmaValidationRequest, AgmaRegistrationRequest
from ....dependencies.bucket3 import upload_image
from ...events.model.events import Events
from ...events.schema.requests import AgmaEventSetup
from sqlalchemy.dialects.postgresql import insert
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

    async def register_agma(self, data:AgmaRegistrationRequest):
        verified_account_no = await self.consumer_meter_service.verfify_account_no(account_no=data.account_no)
        if verified_account_no: 
            is_registered  = await self.get_agma_registration_service.verify_registration(verified_account_no.account_no)
            if is_registered:
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Already Registered")
            else:
                try:
                    image_url = await upload_image(data.image, folder="agma/profiles")
                    signature_url = await upload_image(data.signature, folder="agma/signatures")
                    if not image_url and  not signature_url:
                        raise HTTPException(status_code=status.HTTP_424_FAILED_DEPENDENCY, detail="Image Upload Failed")
                    stmt = insert(AgmaRegistration).values(
                        account_no=data.account_no,
                        name = data.name,
                        phone = data.mobile_no,
                        image = image_url,
                        signature = signature_url
                    ).returning(AgmaRegistration.id)
                    results = await self.session.execute(stmt)
                    await self.session.commit()
                    new_row = results.scalar_one()
                    return {
                        "message": "Registered Successfully",
                        "id": new_row
                        }
                except Exception as e:
                    print(e)
                    raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
                
    async def setup_agma_event(self,data:AgmaEventSetup):
        try:
            
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
            print(e)
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    