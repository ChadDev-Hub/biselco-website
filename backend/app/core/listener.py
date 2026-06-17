import json
from .redis import  CHANNEL, redis_client
import asyncio
import json

async def process_incoming_payload(message, manager):
    """Safely processes a single Redis message payload without affecting the loop."""
    
    try:
        if message.get("type") != "message":
            return
        
        raw_data = message.get("data")
        if isinstance(raw_data, bytes):
            raw_data = raw_data.decode('utf-8')
            
        data = json.loads(raw_data)
        
        match data.get("type"):
            case "all":
                await manager.broadcast(data["data"])

            case "admins":
                inner_data = data.get('data')
                user_ids = data.get('user_ids')
                # Broadcast concurrently to all admins safely
                async def safe_send(uid):
                    try:
                        await manager.broad_cast_personal_json(uid, inner_data)
                    except Exception as socket_err:
                        print(f"!!! Failed broadcasting to websocket user {uid}: {socket_err}")

                await asyncio.gather(*(safe_send(uid) for uid in user_ids))
                
                
            case _:
                print(f"--> Unknown message type: {data.get('type')}")

    except Exception as process_error:
        print("!!! Error parsing or routing message data payload:", process_error)


async def redis_listener(manager):
    pubsub = redis_client.pubsub()
    await pubsub.subscribe(CHANNEL)

    print("Redis listener started")

    async for message in pubsub.listen():
        
        
        # CRITICAL FIX: Offload the work to an isolated background worker task immediately.
        # This instantly releases the Redis listener stream loop so it never freezes up!
        asyncio.create_task(process_incoming_payload(message, manager))