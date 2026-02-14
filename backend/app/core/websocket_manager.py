from fastapi import WebSocket, WebSocketDisconnect
from fastapi import Response



class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[int,WebSocket] = {}
        
    async def connect(self, websocket: WebSocket, user_id:int):
        await websocket.accept()
        self.active_connections[user_id] = websocket

    def disconnect(self, user_id):
        self.active_connections.pop(user_id, None)

    async def send_personal_message(self, message: str, user_id:int):
        websocket = self.active_connections.get(user_id)
        if websocket:
            await websocket.send_text(message)
            
    async def broad_cast_personal_json(self, user_id:int, data:dict):
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
    
    
            
manager = ConnectionManager()