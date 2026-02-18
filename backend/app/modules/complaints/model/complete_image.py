from __future__ import annotations
from sqlalchemy import Integer, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship  
from ....db.base import BaseModel
from typing import List, TYPE_CHECKING

if TYPE_CHECKING:
    from .complaints import Complaints

class ComplaintsImageCompleted(BaseModel):
    __tablename__ = "completed_complaint_image"
    id:Mapped[int] = mapped_column(type_=Integer, primary_key=True)
    complaint_id: Mapped[int] = mapped_column(ForeignKey("consumer_complaints.id"), type_=Integer)
    image_url: Mapped[str] = mapped_column(type_=Text, nullable=True)
    # relationships
    complaints: Mapped["Complaints"] = relationship(back_populates="completed_images")