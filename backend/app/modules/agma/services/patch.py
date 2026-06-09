from fastapi import HTTPException, status, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from ....dependencies.db_session import get_session
from ..model.agma_registration import AgmaRegistration
from sqlalchemy.exc import DBAPIError, DataError
from .get import GetAgmaRegistrationService
from ...websocket.websocket_manager import manager
from ...user.service.get_user import GetUserServices


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
            for admin in admins:
                data = {"detail": "agma_raffle_stats",
                        "data": new_stats.model_dump(mode="json")}
                await manager.broad_cast_personal_json(
                    user_id=admin,
                    data=data
                )
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
    