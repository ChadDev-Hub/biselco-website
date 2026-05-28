from __future__ import annotations
from sqlalchemy import Integer,  Date, func, Boolean, Text, DateTime, ForeignKey, Time, UUID
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime, date, time 
from sqlalchemy.orm import relationship
from ....db.base import BaseModel

import uuid
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from ..model.events import Events


class EventsSchedules(BaseModel):
    __tablename__ = "event_schedules"
    __table_args__ = {"schema": "public"}
    id:Mapped[uuid.UUID] = mapped_column(type_=UUID(), primary_key=True, default=uuid.uuid4, unique=True)
    event_id:Mapped[int] = mapped_column(ForeignKey("public.events.id"),type_=Integer, nullable=False)
    area: Mapped[str] = mapped_column(type_=Text, nullable=True)
    event_location:Mapped[str] = mapped_column(type_=Text, nullable=True)
    event_date:Mapped[datetime] = mapped_column(type_=DateTime(timezone=True), nullable=True)
    events: Mapped["Events"] = relationship(back_populates="schedules")