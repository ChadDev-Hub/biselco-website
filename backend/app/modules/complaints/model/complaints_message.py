from __future__ import annotations
from sqlalchemy import Integer, ForeignKey, Text, DateTime, Date, Time, Boolean, func, Uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship
from ....db.base import BaseModel
from datetime import datetime
from ...user.model.users import Users
from .complaints import Complaints
from typing import TYPE_CHECKING
from datetime import datetime
from uuid import UUID

class ComplaintsMessage(BaseModel):
    __tablename__ = "complaints_message"
    id: Mapped[UUID] = mapped_column(primary_key=True, autoincrement=False, type_=Uuid)
    complaints_id: Mapped[int] = mapped_column(ForeignKey("consumer_complaints.id"))
    sender_id: Mapped[UUID] = mapped_column(ForeignKey("users_account.id"))
    receiver_id: Mapped[UUID] = mapped_column(ForeignKey("users_account.id"), nullable=True)
    is_admin: Mapped[bool] = mapped_column(Boolean, default=False)
    sender_status: Mapped[str] = mapped_column(Text, nullable=True)
    receiver_status: Mapped[str] = mapped_column(Text, nullable=True)
    message: Mapped[str] = mapped_column(Text, nullable=True)
    timestamped: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=func.now())
    
    
    complaints: Mapped["Complaints"] = relationship(back_populates="complaint_messages")
    sender: Mapped["Users"] = relationship(back_populates="complaint_messages_sender", foreign_keys=[sender_id])
    receiver: Mapped["Users"] = relationship(back_populates="complaint_messages_receiver", foreign_keys=[receiver_id])