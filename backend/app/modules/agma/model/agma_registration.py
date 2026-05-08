from __future__ import annotations
from sqlalchemy import Integer,  Date, func, Boolean, Text, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime, date
from sqlalchemy.orm import relationship
from ....db.base import BaseModel
from datetime import datetime
from typing import TYPE_CHECKING
from ...gis.consumer.model.consumer import ConsumerMeter




class AgmaRegistration(BaseModel):
    __tablename__ = "agma_registration"
    __table_args__ = {"schema": "public"}
    id:Mapped[int] = mapped_column(type_=Integer, primary_key=True)
    account_no:Mapped[str] = mapped_column(
        ForeignKey("gis.consumer_meter.account_no", ondelete="CASCADE", onupdate="CASCADE"),
                                           type_=Text,
                                           nullable=False)
    name:Mapped[str] = mapped_column(type_=Text, nullable=False)
    phone:Mapped[str] = mapped_column(type_=Text, nullable=False)
    image:Mapped[str] = mapped_column(type_=Text, nullable=False)
    signature:Mapped[str] = mapped_column(type_=Text, nullable=False)
    timestamped: Mapped[datetime] = mapped_column(type_=DateTime(timezone=True), nullable=False, default=func.now())
    
    consumer: Mapped[ConsumerMeter] = relationship("ConsumerMeter", back_populates="agma")