from contextlib import asynccontextmanager
from fastapi import FastAPI
from .listener import redis_listener
from ..modules.websocket.websocket_manager import manager
import asyncio

@asynccontextmanager
async def lifespan(app: FastAPI):
    redis_task = asyncio.create_task(redis_listener(manager))

    print("App Started")
   
    try:
        yield
    finally:
        redis_task.cancel()

        try:
            await redis_task
        except asyncio.CancelledError:
            pass

        print("App Stopped")