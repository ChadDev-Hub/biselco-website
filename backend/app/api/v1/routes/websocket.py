from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, status, HTTPException
from ....core.websocket_manager import manager
from ....core.security import get_current_user_ws

router = APIRouter(prefix="/socket", tags=['Socket'])
@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    user = await get_current_user_ws(websocket)
    if not user:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return
    await manager.connect(websocket=websocket, user_id=user['user_id']) 
    try:
        while True:
            json = await websocket.receive_json()
    except WebSocketDisconnect:
        manager.disconnect(user['user_id'])
    
    