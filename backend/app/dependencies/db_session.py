from sqlalchemy.ext.asyncio.session import AsyncSession
from ..db.session import async_session

# DB SESSION 
async def get_session():
    async with async_session.begin() as session:
        yield session
    

