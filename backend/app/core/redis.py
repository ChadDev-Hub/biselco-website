import redis.asyncio as redis
import json



redis_client = redis.from_url("redis://localhost:6379", decode_responses=True)

CHANNEL = "ws-events"



async def redis_listener(manager):
    pubsub = redis_client.pubsub()
    await pubsub.subscribe(CHANNEL)

    async for message in pubsub.listen():
        try:
            if message["type"] != "message":
                continue
            print(message)
            data = json.loads(message["data"])

            match data.get("type"):
                case "all":
                    await manager.broadcast(data.get("data"))

                case "personal":
                    user_id = data.get("user_id")
                    payload = data.get("data")

                    if user_id and payload:
                        await manager.broad_cast_personal_json(user_id, payload)

        except Exception as e:
            print("Redis listener error:", e)