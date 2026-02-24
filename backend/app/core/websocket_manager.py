from fastapi import WebSocket, WebSocketDisconnect
from fastapi import Response
import asyncio
from uuid import UUID


class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[str,WebSocket] = {}
    async def connect(self, websocket: WebSocket, user_id:str):
        await websocket.accept()
        self.active_connections[user_id] = websocket
        await self.broadcastPresence(user_id, "online")

    def disconnect(self, user_id):
        self.active_connections.pop(user_id, None)
        asyncio.create_task(self.broadcastPresence(user_id, "offline"))

    async def send_personal_message(self, message: str, user_id:str):
        websocket = self.active_connections.get(user_id)
        if websocket:
            await websocket.send_text(message)
            
    async def broad_cast_personal_json(self, user_id:str, data:dict):
        websocket = self.active_connections.get(user_id)
        if websocket:
            await websocket.send_json(data)

    async def broadcast(self, json:dict):
        disconnected = []
        try: 
            for user_id, websockets in self.active_connections.items():
                await websockets.send_json(json)
        except Exception:
            disconnected.append(user_id)
        for user_id in disconnected:
            self.disconnect(user_id)
    
    async def broadcastPresence(self, user_id:str, status:str):
        await self.broadcast({
            "detail": "presence",
            "data":{
                "user_id": str(user_id),
                "user_status": status
            }
        })
            
manager = ConnectionManager()