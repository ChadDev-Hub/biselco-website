from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, status, HTTPException
from ....core.websocket_manager import manager
from ....core.security import get_current_user_ws
from ....dependencies.db_session import get_session
from sqlalchemy.ext.asyncio import AsyncSession
from pprint import pprint
from ....modules.complaints.services.complaints_messages import add_complaints_message
router = APIRouter(prefix="/socket", tags=['Socket'])
@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket, session: AsyncSession = Depends(get_session)):
    user = await get_current_user_ws(websocket)
    if not user:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return
    await manager.connect(websocket=websocket, user_id=str(user.user_id)) 
    try:
        while True:
            json = await websocket.receive_json()
            json['sender_id'] = str(user.user_id)
            for_sending = {
                "detail": "complaint_message",
                "data": {
                    "complaint_id": json.get("complaint_id"),
                    "message": json.get("message"),
                    "sender_id": json.get("sender_id"),
                    "receiver_id": json.get("receiver_id")
                }
            }
            await manager.broad_cast_personal_json(user_id=json.get("sender_id"), data=for_sending)
    except WebSocketDisconnect:
        manager.disconnect(user_id=str(user.user_id))
    
    