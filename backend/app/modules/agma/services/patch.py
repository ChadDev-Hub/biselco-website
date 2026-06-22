from fastapi import HTTPException, status, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, insert
from ....dependencies.db_session import get_session
from ..model.agma_registration import AgmaRegistration, AgmaVerificationMonitoring
from sqlalchemy.exc import DBAPIError, DataError
from .get import GetAgmaRegistrationService
from ...websocket.websocket_manager import manager
from ...user.service.get_user import GetUserServices
from ....core.redis import redis_client, CHANNEL
import json

class AgmaRegistrationPatchService():
    def __init__(self,
                 get_services:GetAgmaRegistrationService = Depends(GetAgmaRegistrationService),
                 get_user:GetUserServices = Depends(GetUserServices)):
        self.session = get_services.session
        self.get_services = get_services
        self.get_user = get_user
    async def update_winner_status(self, id:str):
        
        try:
            await self.session.execute(
                update(AgmaRegistration)
                .where(AgmaRegistration.id == id)
                .values(is_winner=True)
            )
            await self.session.commit()
            new_stats = await self.get_services.raffle_stats()
            
            admins = await self.get_user.get_users_by_roles(roles="admin")
            data = {"detail": "agma_raffle_stats",
                        "data": new_stats.model_dump(mode="json")}
            payload = {
                "type": "admins",
                "user_ids": admins,
                "data": data,
            }
            await redis_client.publish(CHANNEL, json.dumps(payload))
            return {"message": "Winner Saved Successfully"}
            
        except DBAPIError  as e:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Consumer Not Found")
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
    
    async def dismissed_winner(self, id:str):
        try:
            await self.session.execute(
                update(AgmaRegistration)
                .where(AgmaRegistration.id == id)
                .values(is_dismissed=True)
            )
            await self.session.commit()
        except DBAPIError  as e:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Consumer Not Found")
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
    
    async def verify_registered(self, id:str, is_verified:bool, user_id:str):
        try:
            consumer = (await self.session.execute(
                update(AgmaRegistration)
                .where(AgmaRegistration.id == id)
                .values(is_verified=is_verified)
                .returning(AgmaRegistration.id)
            )).scalar_one_or_none()
            await self.session.commit()
            
            insrt_stmt = insert(AgmaVerificationMonitoring).values({
                "agma_ticket_id": consumer,
                "user_id": user_id,
                "comment": "update to verified" if is_verified else "update to unverify"
            })
            await self.session.execute(insrt_stmt)
            await self.session.commit()
            
            admins = await self.get_user.get_users_by_roles(roles="admin")
            updated_registration = await self.get_services.get_registered(id=id)
            # print(updated_registration)
            data = {
                "id": str(updated_registration['id']),
                "is_verified": updated_registration['is_verified'],
                "monitoring": updated_registration['monitoring']
            }
            
            to_send = {
                "detail": "agma_verified_consumer",
                "data": data
            }
            payload = {
                "type": "admins",
                "user_ids": admins,
                "data": to_send
            }
            await redis_client.publish(CHANNEL, json.dumps(payload))
            return {"message": "Registered Verified Status Changes Successfully"}
        
        except DBAPIError  as e:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Consumer Not Found")
        except Exception as e:
            print(e)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))