from .engine import engine
from sqlalchemy.ext.asyncio.session import async_sessionmaker



async_session = async_sessionmaker(
    bind=engine,
    expire_on_commit=False)
    
    