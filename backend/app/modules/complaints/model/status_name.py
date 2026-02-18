from __future__ import annotations
from sqlalchemy import Integer, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from ....db.base import BaseModel
from typing import List, TYPE_CHECKING

if TYPE_CHECKING:
    from .complaints import Complaints
    from .status_update import ComplaintsStatusUpdates


# COMPLAINTS STATUS NAME TABLE 
class ComplaintsStatusName(BaseModel):
    __tablename__ = "complaints_status_name"
    id:Mapped[int] = mapped_column(type_=Integer, primary_key=True)
    status_name:Mapped[str] = mapped_column(type_=Text, unique=True)
    description:Mapped[str] = mapped_column(type_=Text, nullable=True)
    # relationships
    status_updates: Mapped[List["ComplaintsStatusUpdates"]] = relationship(
        back_populates="status")