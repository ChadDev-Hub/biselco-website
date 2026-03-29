from sqlalchemy import Integer, ForeignKey, Text, DateTime, Date, Time
from sqlalchemy.orm import Mapped, mapped_column, relationship
from ....db.base import BaseModel
from datetime import datetime
from ...user.model.users import Users
from .complaints import Complaints

class ComplaintsMessage(BaseModel):
    __tablename__ = "complaints_message"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    complaints_id: Mapped[int] = mapped_column(ForeignKey("consumer_complaints.id"))
    sender_id: Mapped[int] = mapped_column(ForeignKey("users_account.id"))
    receiver_id: Mapped[int] = mapped_column(ForeignKey("users_account.id"))
    message: Mapped[str] = mapped_column(Text, nullable=True)
    timestamp: Mapped[DateTime] = mapped_column(DateTime, default=datetime.now())
    
    
    complaints: Mapped["Complaints"] = relationship(back_populates="complaint_messages")
    sender: Mapped["Users"] = relationship(back_populates="complaint_messages_sender")
    receiver: Mapped["Users"] = relationship(back_populates="complaint_messages_receiver")