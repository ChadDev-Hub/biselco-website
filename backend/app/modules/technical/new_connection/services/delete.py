from sqlalchemy import delete
from sqlalchemy.ext.asyncio import AsyncSession
from ..model.new_connection import NewConnection, NewConnectionImage
from fastapi import HTTPException, status, Depends, Body
from .....dependencies.db_session import get_session
from .get import get_new_connection
from pprint import pprint
from typing import List, Set
from ..schema.requests_model import NewConnectionDelete


# DELETE NEW CONNECTION
async def delete_new_connection(items: NewConnectionDelete = Body(...), session:AsyncSession = Depends(get_session)):
    try: 
        results = (await session.execute(delete(NewConnection).where(NewConnection.id.in_(items.items))))
        await session.commit()
        return {
            "detail": "new_connection_deleted"
        }
    except Exception as e:
        await session.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    
    