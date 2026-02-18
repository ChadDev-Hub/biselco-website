from sqlalchemy.ext.asyncio import create_async_engine
from dotenv import load_dotenv
from .base import BaseModel
from .engine import engine
from sqlalchemy.ext.asyncio.session import async_sessionmaker
import os


async_session = async_sessionmaker(
    bind=engine,
    expire_on_commit=False)
    
    