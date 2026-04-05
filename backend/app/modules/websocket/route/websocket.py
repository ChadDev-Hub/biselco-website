from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, status, HTTPException
from ..websocket_manager import manager
from ....core.security import get_current_user_ws
from ....dependencies.db_session import get_session
from sqlalchemy.ext.asyncio import AsyncSession
from pprint import pprint
from ..services.complaint_message_handler import add_message
router = APIRouter(prefix="/socket", tags=['Socket'])
@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket, session: AsyncSession = Depends(get_session)):
    user = await get_current_user_ws(websocket)
    if not user:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return
    await manager.connect(websocket=websocket, user_id=str(user.user_id))
    user_id = str(user.user_id)
    try:
        while True:
            json = await websocket.receive_json()
            
            if json.get("detail") == "complaint_message":
                data = json.get("data")
                data['sender_id'] = str(user_id)
                result = await add_message(session=session, data=data)
                users = set([result.receiver.id, result.sender.id])
                to_send = {
                    "detail": "complaint_message",
                    "data": result.model_dump()
                }
                for user in users: 
                    await manager.broad_cast_personal_json(user, data=to_send)
    except WebSocketDisconnect:
        manager.disconnect(user_id=str(user_id), websocket=websocket)
    
    