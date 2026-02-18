from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, status, HTTPException
from ....core.websocket_manager import manager
from ....utils.token import get_current_user_ws

router = APIRouter(prefix="/socket", tags=['Socket'])
@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    user = await get_current_user_ws(websocket)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized Transaction")
    await manager.connect(websocket=websocket, user_id=user['user_id']) 
    try:
        while True:
            json = await websocket.receive_json()
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    
    