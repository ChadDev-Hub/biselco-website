from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, status, HTTPException
from ..websocket_manager import manager
from ....core.security import get_current_user_ws
from ....dependencies.db_session import get_session
from sqlalchemy.ext.asyncio import AsyncSession
from pprint import pprint
from ..services.complaint_message_handler import add_message, update_message_status
from ...user.model.roles import Roles
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from ....core.redis import CHANNEL, redis_client
import json
router = APIRouter(prefix="/socket", tags=['Socket'])


@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket, session: AsyncSession = Depends(get_session)):
    user = await get_current_user_ws(websocket)
    if not user:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return
    await manager.connect(websocket=websocket, user_id=str(user.user_id))
    user_id = str(user.user_id)
    admins = (await session.execute(select(Roles)
                                    .options(selectinload(Roles.users))
                                    .where(Roles.name == "admin")
                                    )).scalars().all()
    adm = set([str(user.id) for role in admins for user in role.users])
    try:
        while True:
            json_data = await websocket.receive_json()
            if json_data.get("detail") == "complaint_message":
                data = json_data.get("data")
                data['sender_id'] = str(user_id)
                result = await add_message(session=session, data=data)

                users = set()

                if result['new_message']['receiver'] is not None:
                    users.add(result['new_message']["receiver"]["id"])

                if result['new_message']['sender'] is not None:
                    users.add(result['new_message']["sender"]["id"])
                users = users.union(adm)
                to_send = {
                    "detail": "sent_message",
                    "data": result
                }
                payload = {
                    "type": "admins",
                    "user_ids": list(users),
                    "data": to_send
                }
                await redis_client.publish(CHANNEL, json.dumps(payload))

            elif json_data.get("detail") == "seen_message":
                data = json_data.get("data")
                message_id = data.get("message_ids")

                results = await update_message_status(session=session, data={
                    'ids': message_id,
                    'complaints_id': data.get('complaints_id'),
                    'receiver_status': "Seen",
                    "sender_id": str(user_id)
                })

                users = set()
                for result in results["seen"]:
                    if result["receiver_id"] is not None:
                        users.add(result["receiver_id"])
                    users = users.union(adm)

                seen_message = {
                    "detail": "seen_message",
                    "data": results
                }
                
                payload = {
                    "type": "admins",
                    "user_ids": list(users),
                    "data": seen_message
                }
                await redis_client.publish(CHANNEL, json.dumps(payload))
    except WebSocketDisconnect:
        manager.disconnect(user_id=str(user_id), websocket=websocket)
