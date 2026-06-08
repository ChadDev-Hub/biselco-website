from fastapi import HTTPException, status, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from ....dependencies.db_session import get_session
from ..model.agma_registration import AgmaRegistration
from sqlalchemy.exc import DBAPIError, DataError


class AgmaRegistrationPatchService():
    def __init__(self, session: AsyncSession = Depends(get_session)):
        self.session = session
    
    async def update_winner_status(self, id:str):
        try:
            await self.session.execute(
                update(AgmaRegistration)
                .where(AgmaRegistration.id == id)
                .values(is_winner=True)
            )
            await self.session.commit()
        except DBAPIError  as e:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Consumer Not Found")
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
        