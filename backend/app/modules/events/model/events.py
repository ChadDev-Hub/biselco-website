from __future__ import annotations
from sqlalchemy import Integer,  Date, func, Boolean, Text, DateTime, ForeignKey, Time
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime, date, time
from sqlalchemy.orm import relationship
from ....db.base import BaseModel
from typing import List, TYPE_CHECKING
from .events_schedules import EventsSchedules


class Events(BaseModel):
    __tablename__ = "events"
    __table_args__ = {"schema": "public"}
    id:Mapped[int] = mapped_column(type_=Integer, primary_key=True)
    title:Mapped[str] = mapped_column(type_=Text, nullable=False)
    description:Mapped[str] = mapped_column(type_=Text, nullable=False)
    start_date:Mapped[date] = mapped_column(type_=Date, nullable=False)
    end_date:Mapped[date] = mapped_column(type_=Date, nullable=False)
    is_active:Mapped[bool] = mapped_column(type_=Boolean, nullable=False, default=True)
    created_at:Mapped[datetime] = mapped_column(type_=DateTime(timezone=True), nullable=False, default=func.now())
    start_time: Mapped[time] = mapped_column(type_=Time, nullable=True)
    end_time: Mapped[time] = mapped_column(type_=Time, nullable=True)
    # Relationship
    images:Mapped[List["EventsImages"]] = relationship(back_populates="events",cascade="all, delete-orphan")
    schedules:Mapped[List["EventsSchedules"]] = relationship(back_populates="events",cascade="all, delete-orphan")

class EventsImages(BaseModel):
    __tablename__ = "event_images"
    __table_args__ = {"schema": "public"}
    id:Mapped[int] = mapped_column(type_=Integer, primary_key=True)
    event_id:Mapped[int]  = mapped_column(ForeignKey("public.events.id"), type_=Integer, nullable=False)
    uploaded_at:Mapped[datetime] = mapped_column(type_=DateTime(timezone=True),nullable=True, default=func.now())
    url:Mapped[str] = mapped_column(type_=Text, nullable=True)
    
    # Relationship
    events: Mapped["Events"] = relationship(back_populates="images")
    
