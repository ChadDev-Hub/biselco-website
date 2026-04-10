from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, status, HTTPException
from ..websocket_manager import manager
from ....core.security import get_current_user_ws
from ....dependencies.db_session import get_session
from sqlalchemy.ext.asyncio import AsyncSession
from pprint import pprint
from ..services.complaint_message_handler import add_message, update_message_status
from ...user.model.users import Users
from ...user.model.roles import Roles
from sqlalchemy import select
from sqlalchemy.orm import selectinload
router = APIRouter(prefix="/socket", tags=['Socket'])

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket, session: AsyncSession = Depends(get_session)):
    user = await get_current_user_ws(websocket)
    if not user:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return
    await manager.connect(websocket=websocket, user_id=str(user.user_id))
    user_id = str(user.user_id)
    admins =(await session.execute(select(Roles)
                             .options(selectinload(Roles.users))
                             .where(Roles.name == "admin")
                             )).scalars().all()
    adm = set([str(user.id) for role in admins for user in role.users])
    try:
        while True:
            json = await websocket.receive_json()
            if json.get("detail") == "complaint_message":
                data = json.get("data")
                data['sender_id'] = str(user_id)
                result = await add_message(session=session, data=data)
                if result.receiver:
                    users = set([result.receiver.id])
                else:
                    users = set()
                if result.sender:
                    users.add(result.sender.id)
                users = users.union(adm)
                to_send = {
                    "detail": "complaint_message",
                    "data": result.model_dump()
                }
                for user in users: 
                    if not user:
                        continue
                    await manager.broad_cast_personal_json(user, data=to_send)
            elif json.get("detail") == "seen_message":
                data = json.get("data")
                message_id = [value['id'] for key, value in data.items() if value['receiver_status'] == 'Unread']
                results = await update_message_status(session=session, data={
                    'ids': message_id,
                    'receiver_status': "Seen"
                })
                seen_message = {
                    "detail": "seen_message",
                    "data": [result.model_dump() for result in results]
                }
                users = set()
                for result in results:
                    if result.receiver_id is not None:
                        users.add(result.receiver_id)
                    users = users.union(adm)
                for user in users:
                    await manager.broad_cast_personal_json(user, data=seen_message)
    except WebSocketDisconnect:
        manager.disconnect(user_id=str(user_id), websocket=websocket)
    
    