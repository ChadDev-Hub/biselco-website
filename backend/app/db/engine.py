from sqlalchemy.ext.asyncio import create_async_engine
from dotenv import load_dotenv
from .base import BaseModel
import os

load_dotenv()
USERNAME = os.getenv("POSTGRESUSER")
PASSWORD = os.getenv("PASSWORD")
DBNAME = os.getenv("DBNAME")
HOST = os.getenv("HOST")
PORT = os.getenv("PORT")



engine = create_async_engine(f"postgresql+asyncpg://{USERNAME}:{PASSWORD}@{HOST}:{PORT}/{DBNAME}")

async def create_table():
    '''
    Dbconnection Function that create ALL Metadata table
    '''
    async with engine.begin() as conn:
        print("CREATING TABLE...")
        await conn.run_sync(BaseModel.metadata.create_all)
        print("TABLE CREATED!!")

async def close():
    '''Cloase Database connection'''
    if engine:
        await engine.dispose()