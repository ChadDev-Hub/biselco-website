from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from ....core.websocket_manager import manager
from ....utils.token import get_current_user_ws

router = APIRouter(prefix="/socket", tags=['Socket'])
@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    user_id = await get_current_user_ws(websocket)    
    await manager.connect(websocket,user_id=user_id['userid'])  
    try:
        while True:
            text = await websocket.receive_text()
            json = await websocket.receive_json()
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    