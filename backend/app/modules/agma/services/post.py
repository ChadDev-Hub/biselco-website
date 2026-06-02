from sqlalchemy import select, func, and_
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
from ...websocket.websocket_manager import manager
from ...user.service.get_user import GetUserServices
from ..schema.response import AgmaSetup, RegisteredOvertime, AgmaStats, AgmaCountRegistered
from uuid import uuid4


class PostAgmaRegistrationService:
    def __init__(self,
                 consumer_meter_service: ConsumerMeterGetService = Depends(
                     ConsumerMeterGetService),
                 get_agma_registration_service: GetAgmaRegistrationService = Depends(
                     GetAgmaRegistrationService),
                 get_user_services: GetUserServices = Depends(GetUserServices)
                 ):
        self.session = consumer_meter_service.session
        self.consumer_meter_service = consumer_meter_service
        self.get_agma_registration_service = get_agma_registration_service
        self.get_user_services = get_user_services
        self.websocket_manager = manager
        self.event_id = str(uuid4())

    async def register_agma(self, data: AgmaRegistrationRequest):
        # CHECK IF AGMA EVEN IS AVAILABLE
        check_agma_event = (await self.session.execute(select(Events.id).where(
            Events.title.ilike("%AGMA%"),
            func.now().between(Events.start_date + Events.start_time,
                               Events.end_date + Events.end_time)
        ))).scalar_one_or_none()
        if not check_agma_event:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Agma Registration Closed")
        # CHECK IF ACCOUNT NUMBER IS EXISTS
        verified_account_no = await self.consumer_meter_service.verfify_account_no(account_no=data.account_no)
        if verified_account_no:
            # CHECK IF ALREADY REGISTERED
            is_registered = await self.get_agma_registration_service.verify_registration(verified_account_no.account_no)
            if is_registered:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED, detail="Already Registered")
            else:
                try:
                    image_url = await upload_image(data.image, folder="agma/profiles")
                    signature_url = await upload_image(data.signature, folder="agma/signatures")
                    if not image_url and not signature_url:
                        raise HTTPException(
                            status_code=status.HTTP_424_FAILED_DEPENDENCY, detail="Image Upload Failed")
                    stmt = insert(AgmaRegistration).values(
                        account_no=data.account_no,
                        name=data.name,
                        phone=data.mobile_no,
                        image=image_url,
                        signature=signature_url
                    ).returning(AgmaRegistration.id)
                    results = await self.session.execute(stmt)
                    await self.session.commit()
                    new_row = results.scalar_one()
                    # NEWLY REGISTERED
                    new_registered = await self.get_agma_registration_service.get_registered(new_row)
                    # STATS UPDATE
                    new_stats = await self.get_agma_registration_service.get_stats()
                    # COUNT PER VILLAGE
                    count_per_village = await self.get_agma_registration_service.get_graph_data()
                    # REGISTERED OVERTIME
                    registered_overtime = await self.get_agma_registration_service.get_registered_overtime()
                    admins = await self.get_user_services.get_users_by_roles(roles="admin")
                    payload = {
                            "detail": "new_registered",
                            "new_regs": new_registered,
                            "new_stats": [AgmaStats(**stat).model_dump(mode="json") for stat in new_stats],
                            "count_per_village": [AgmaCountRegistered(**item).model_dump(mode="json") for item in count_per_village],
                            "registered_overtime": [RegisteredOvertime(**item).model_dump(mode="json") for item in registered_overtime]
                            }
                    
                    for admin in admins:
                        try:
                            await self.websocket_manager.broad_cast_personal_json(
                                user_id=admin,
                                data=payload
                            )
                        except Exception as e:
                            print(e)
                            raise HTTPException(
                                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
                    return {
                        "message": "Registered Successfully",
                        "id": new_row
                    }
                except Exception as e:
                    print(e)
                    raise HTTPException(
                        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

    async def setup_agma_event(self, data: AgmaEventSetup):
        try:

            insert_stmt = insert(Events).values(data.model_dump(mode="python"))
            stmt = insert_stmt.on_conflict_do_update(index_elements=[Events.title], set_={
                Events.start_date: insert_stmt.excluded.start_date,
                Events.end_date: insert_stmt.excluded.end_date,
                Events.start_time: insert_stmt.excluded.start_time,
                Events.end_time: insert_stmt.excluded.end_time
            })
            await self.session.execute(stmt)
            await self.session.commit()

            # SEND NOTIFICATION ON NEW AGMA SETUP IN EVERY ADMINS
            latest_agma_setup = await self.get_agma_registration_service.get_agma_setup()
            admins = await self.get_user_services.get_users_by_roles(roles="admin")
            for admin in admins:
                await self.websocket_manager.broad_cast_personal_json(
                    user_id=admin,
                    data={
                        "detail": "agma_setup",
                        "event_id": self.event_id,
                        "message": "New Agma Setup Updated",
                        "data": AgmaSetup(**latest_agma_setup).model_dump(mode="json")
                    }
                )
            return {"message": "You have successfully updated the Agma Setup"}
        except Exception as e:
            print(e)
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
