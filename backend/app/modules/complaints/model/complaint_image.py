from __future__ import annotations
from sqlalchemy import Integer, Text, ForeignKey, DateTime, Date, Time
from sqlalchemy.orm import Mapped, mapped_column, relationship
from ....db.base import BaseModel
from datetime import datetime
from typing import List, TYPE_CHECKING

if TYPE_CHECKING:
    from .complaints import Complaints




# COMPLAINTS IMAGES
class ComplaintsImage(BaseModel):
    __tablename__ = "complaints_images"
    id:Mapped[int] = mapped_column(type_=Integer, primary_key=True)
    complaints_id: Mapped[int]  = mapped_column(ForeignKey("consumer_complaints.id"), type_=Integer)
    uploaded_at: Mapped[datetime] = mapped_column(type_=DateTime(timezone=True))
    image_url:Mapped[str] = mapped_column(type_=Text, nullable=True)
    
    # relationships
    complaints: Mapped["Complaints"] = relationship(back_populates="complaints_image")