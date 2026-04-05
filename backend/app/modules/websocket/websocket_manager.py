from fastapi import WebSocket, WebSocketDisconnect
from fastapi import Response
import asyncio
from typing import Set, Dict
from uuid import UUID
from collections import defaultdict


class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, Set[WebSocket]] = defaultdict(set)

    async def connect(self, websocket: WebSocket, user_id: str):
        await websocket.accept()
        self.active_connections[user_id].add(websocket)
        await self.broadcastPresence(user_id, "online")

    def disconnect(self, user_id, websocket: WebSocket):
        if user_id in self.active_connections:
            self.active_connections[user_id].discard(websocket)
            if len(self.active_connections[user_id]) == 0:
                del self.active_connections[user_id]
                asyncio.create_task(self.broadcastPresence(user_id, "offline"))

    async def send_personal_message(self, message: str, user_id: str):
        if user_id in self.active_connections:
            for socket in self.active_connections[user_id]:
                try:
                    await socket.send_text(message)
                except Exception:
                    self.active_connections['user_id'].discard(socket)

    async def broad_cast_personal_json(self, user_id: str, data: dict):
        if user_id in self.active_connections:
            for socket in self.active_connections[user_id]:
                try:
                    await socket.send_json(data)
                except Exception:
                    self.active_connections['user_id'].discard(socket)

    async def broadcast(self, json: dict):

        for user_id, websockets in self.active_connections.items():
            for socket in list(websockets):
                try:
                    await socket.send_json(json)
                except Exception:
                    websockets.discard(socket)
            if len(websockets) == 0:
                del self.active_connections[user_id]
                await self.broadcastPresence(user_id, "offline")

    async def broadcastPresence(self, user_id: str, status: str):
        await self.broadcast({
            "detail": "presence",
            "data": {
                "user_id": str(user_id),
                "user_status": status
            }
        })


manager = ConnectionManager()
