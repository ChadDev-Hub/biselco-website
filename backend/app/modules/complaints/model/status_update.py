from __future__ import annotations
from sqlalchemy import Integer, Text, ForeignKey, DateTime, Date, Time
from sqlalchemy.orm import Mapped, mapped_column, relationship
from ....db.base import BaseModel
from datetime import time, date
from typing import List, TYPE_CHECKING

if TYPE_CHECKING:
    from .complaints import Complaints
    from .status_name import ComplaintsStatusName


# COMPLAINTS STATUS
class ComplaintsStatusUpdates(BaseModel):
    __tablename__ = "complaints_status"
    id:Mapped[int] = mapped_column(type_=Integer, primary_key=True)
    complaint_id: Mapped[int] = mapped_column(
        ForeignKey("consumer_complaints.id", ondelete="CASCADE", onupdate="CASCADE"),
        type_=Integer)
    status_id: Mapped[int] = mapped_column(
        ForeignKey("complaints_status_name.id", ondelete="CASCADE", onupdate="CASCADE"),
        type_=Integer)
    date: Mapped[date] = mapped_column(type_=Date)
    time: Mapped[time] = mapped_column(type_=Time)
    # relationships
    complaints: Mapped["Complaints"] = relationship(back_populates="status_updates")
    status: Mapped["ComplaintsStatusName"] = relationship(back_populates="status_updates")