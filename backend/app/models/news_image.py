from __future__ import annotations
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, Text, Boolean, Time, Date, ForeignKey
from ..db.base import BaseModel
from datetime import time, date
from typing import List, TYPE_CHECKING


if TYPE_CHECKING:
    from .news import News
    
class NewsImages(BaseModel):
    __tablename__="news_images"
    id:Mapped[int] = mapped_column(
        primary_key=True,
        type_=Integer
    )
    news_id:Mapped[int] = mapped_column(
        ForeignKey("news.id", ondelete="CASCADE", onupdate="CASCADE"),
        type_=Integer
    )
    url:Mapped[str] = mapped_column(
        type_=Text
    )
    
    news:Mapped["News"] = relationship(back_populates="news_images")
    