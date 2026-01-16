from __future__ import annotations
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, Text, Boolean, Time, Date, ForeignKey
from ..db.base import BaseModel
from datetime import time, date
from typing import List, TYPE_CHECKING

if TYPE_CHECKING:
    from .users import Users
    from .news_image import NewsImages
    
class News(BaseModel):
    """
    Table for News
    id:int: Primarykey
    title:str: Title for the News
    desciption:str: desciption for the News
    dateposted:date: dateposted for the News
    timeposted:time: TimePosted for the News
    image:str: Images for the News
    """
    __tablename__= "news"
    id:Mapped[int] = mapped_column(type_=Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users_account.id", ondelete="CASCADE", onupdate="CASCADE"))
    title:Mapped[str] = mapped_column(type_=Text, nullable=False)
    description:Mapped[str] = mapped_column(type_=Text, nullable=False)
    date_posted:Mapped[date] = mapped_column(type_=Date)
    time_posted:Mapped[time] = mapped_column(type_=Time)
    
    
    user: Mapped[Users] = relationship(
        back_populates="news"
    )
    news_images:Mapped[List['NewsImages']] = relationship(
        back_populates="news"
    )