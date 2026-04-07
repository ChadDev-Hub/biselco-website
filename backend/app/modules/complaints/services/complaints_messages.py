from sqlalchemy.ext.asyncio import AsyncSession
from ....dependencies.db_session import get_session
from ..model.complaints_message import ComplaintsMessage
from ...websocket.schema.response_model import Message, User
from sqlalchemy.orm import selectinload
from sqlalchemy import insert, select
from pprint import pprint


async def get_message(session: AsyncSession, complaints_id: int):
    message = (await session.execute(select(ComplaintsMessage)
                                     .options(selectinload(ComplaintsMessage.sender), selectinload(ComplaintsMessage.receiver))
                                     .where(ComplaintsMessage.complaints_id == complaints_id)
                                     .order_by(ComplaintsMessage.timestamped))).scalars().all()
    pprint(message)
    data = [

        Message(
            id=m.id,
            complaints_id=m.complaints_id,
            sender=User(id=str(m.sender.id), first_name=m.sender.first_name,
                        last_name=m.sender.last_name, photo=m.sender.photo),
            receiver=User(id=str(m.receiver.id) if m.receiver else None,
                          first_name=m.receiver.first_name if m.receiver else None,
                          last_name=m.receiver.last_name if m.receiver else None,
                          photo=m.receiver.photo) if m.receiver else None,
            sender_status=m.sender_status,
            receiver_status=m.receiver_status,
            message=m.message,
            date=m.timestamped.strftime("%Y-%m-%d"),
            time=m.timestamped.strftime("%I:%M %p"),
        )
        for m in message
    ]
  
    return data
