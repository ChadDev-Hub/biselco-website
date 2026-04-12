from sqlalchemy.dialects.postgresql import insert
from ...complaints.model.complaints_message import ComplaintsMessage
from sqlalchemy.ext.asyncio import AsyncSession
from ..schema.response_model import Message, User, SeenMessage, UnreadMessages
from sqlalchemy.orm import selectinload
from sqlalchemy import select, update, func, and_
import pytz


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
        id=str(message.id),
        complaints_id=message.complaints_id,
        sender=User(
            id=str(message.sender.id),
            first_name=message.sender.first_name,
            last_name=message.sender.last_name,
            photo=message.sender.photo
        ),
        receiver=User(
            id=str(message.receiver.id) if message.receiver else None,
            first_name=message.receiver.first_name if message.receiver else None,
            last_name=message.receiver.last_name if message.receiver else None,
            photo=message.receiver.photo if message.receiver else None
        ),
        sender_status=message.sender_status,
        receiver_status=message.receiver_status,
        message=message.message,
        date=message.timestamped.astimezone(
            pytz.timezone('Asia/Manila')).strftime("%Y-%m-%d"),
        time=message.timestamped.astimezone(
            pytz.timezone('Asia/Manila')).strftime("%I:%M %p")
    )


async def update_message_status(session: AsyncSession, data: dict):
    
    stmt = await session.execute(update(ComplaintsMessage).values(
        receiver_status=data['receiver_status'])
        .where(ComplaintsMessage.id.in_(data['ids']))
        .returning(ComplaintsMessage))
    await session.commit()
    results = stmt.scalars().all()
    unread = (await session.execute(select
              (
               func.count(ComplaintsMessage.id).label("count"))
              .where(
                  and_(ComplaintsMessage.receiver_status == "Unread",
                       ComplaintsMessage.complaints_id == data['complaints_id']
                       )))).scalar()
    return {
        
            "unread": UnreadMessages(
                complaints_id=data['complaints_id'],
                unread_messages=unread if unread else 0
            ).model_dump(),
            "seen":
            [
                SeenMessage(
                    id=str(res.id),
                    complaints_id=res.complaints_id,
                    receiver_status=res.receiver_status,
                    receiver_id=str(res.receiver_id)
                ).model_dump()
                for res in results
            ]
        }
    
