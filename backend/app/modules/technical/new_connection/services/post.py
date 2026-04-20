from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from ..model.new_connection import NewConnection, NewConnectionImage
from geoalchemy2.functions import ST_Point

async def create_new_connection(session: AsyncSession, new_connection: dict, image: str = None):
    stmt = NewConnection(
        **new_connection)
    if image:
        stmt.images.append(NewConnectionImage(image=image))
    try:
        session.add(stmt)
        await session.commit()
        return new_connection
    except Exception as e:
        await session.rollback()
        print(e)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
   