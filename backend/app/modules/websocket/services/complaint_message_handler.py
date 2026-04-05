from sqlalchemy.dialects.postgresql import insert
from ...complaints.model.complaints_message import ComplaintsMessage
from sqlalchemy.ext.asyncio import AsyncSession
from ..schema.response_model import Message, User
from sqlalchemy.orm import selectinload
from sqlalchemy import select
import datetime


async def add_message(session: AsyncSession, data: dict):
    data['sender_status'] = "Delivered"
    data['receiver_status'] = "Unread"
    stmt = (
        insert(ComplaintsMessage)
        .values(**data)
        .returning(ComplaintsMessage.id))
    result = await session.execute(stmt)
    await session.commit()

    new_data = result.scalar_one()

    stmt = (select(ComplaintsMessage)
            .options(selectinload(ComplaintsMessage.sender),
                    selectinload(ComplaintsMessage.receiver))
            .where(ComplaintsMessage.id == new_data))
    message = (await session.execute(stmt)).scalar_one()
    return Message(
        id=message.id,
        complaints_id=message.complaints_id,
        sender=User(
            id=str(message.sender.id),
            first_name=message.sender.first_name,
            last_name=message.sender.last_name,
            photo=message.sender.photo
        ),
        receiver=User(
            id=str(message.receiver.id),
            first_name=message.receiver.first_name,
            last_name=message.receiver.last_name,
            photo=message.receiver.photo
        ),
        sender_status=message.sender_status,
        receiver_status=message.receiver_status,
        message=message.message,
        date=message.timestamped.strftime("%Y-%m-%d"),
        time=message.timestamped.strftime("%I:%M %p")
    )
