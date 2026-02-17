from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from ....core.websocket_manager import manager
from ....utils.token import get_current_user_ws

router = APIRouter(prefix="/socket", tags=['Socket'])
@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket, user:dict = Depends(get_current_user_ws)):
    await manager.connect(websocket,user_id=user['userid'])  
    try:
        while True:
            text = await websocket.receive_text()
            json = await websocket.receive_json()
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    