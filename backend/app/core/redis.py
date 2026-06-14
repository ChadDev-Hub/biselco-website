import redis.asyncio as aioredis
import os
from dotenv import load_dotenv
load_dotenv()
REDIS_HOST = os.getenv("REDIS_HOST")
CHANNEL = "ws-events"
REDIS_URL = f"redis://{REDIS_HOST}:6379/0"
redis_client = aioredis.from_url(REDIS_URL, decode_responses=True, retry_on_timeout=True, health_check_interval=30)



