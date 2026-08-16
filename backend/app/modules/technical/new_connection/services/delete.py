from sqlalchemy import update, func
from sqlalchemy.ext.asyncio import AsyncSession
from ..model.new_connection import NewConnection, NewConnectionImage
from fastapi import HTTPException, status, Depends
from .....dependencies.db_session import get_session
from typing import List
from ..schema.response_model import NewConnectionDeleteResponse
from .get import GetServices
from .get import PAGESIZE


class DeleteServices(GetServices):
    """
    Delete Services For New Connection
    
    functions:
        - delete_new_connection
    """
    def __init__(self, session: AsyncSession = Depends(get_session)):
        self.session = session
# DELETE NEW CONNECTION
    async def delete_new_connection(self,items: List[int]):
        """
        Update New Connection as Deleted
        Args:
            items (List[int]) : List of New Connection ID

        Raises:
            HTTP_400_BAD_REQUEST : If there is an error

        Returns:
            str : "New Connection Deleted Successfully"
        """
        try: 
            stmt =  update(NewConnection).where(NewConnection.id.in_(items)).values(is_deleted=True, datetime_deleted=func.now())
            await self.session.execute(stmt)
            await self.session.commit()
            stats = await self.get_new_connection_stats()
            return NewConnectionDeleteResponse(
                detail="new_connection_deleted",
                deleted_id=items,
                stats= stats,
                message="New Connection has been deleted successfully")
        except Exception as e:
            print(e)
            await self.session.rollback()
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    
    