from __future__ import annotations
from sqlalchemy import Integer,  Date, func, Boolean, Text, DateTime, ForeignKey, UUID
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime, date
from sqlalchemy.orm import relationship
from ....db.base import BaseModel
from datetime import datetime
from typing import TYPE_CHECKING
from ...gis.consumer.model.consumer import ConsumerMeter
import uuid



class AgmaRegistration(BaseModel):
    __tablename__ = "agma_registration"
    __table_args__ = {"schema": "public"}
    id:Mapped[uuid.UUID] = mapped_column(type_=UUID, primary_key=True, default=uuid.uuid4)
    account_no:Mapped[str] = mapped_column(
        ForeignKey("gis.consumer_meter.account_no", ondelete="CASCADE", onupdate="CASCADE"),
                                           type_=Text,
                                           nullable=False)
    name:Mapped[str] = mapped_column(type_=Text, nullable=False)
    phone:Mapped[str] = mapped_column(type_=Text, nullable=False)
    image:Mapped[str] = mapped_column(type_=Text, nullable=False)
    signature:Mapped[str] = mapped_column(type_=Text, nullable=False)
    timestamped: Mapped[datetime] = mapped_column(type_=DateTime(timezone=True), nullable=False, default=func.now())
    sample_bill: Mapped[str] = mapped_column(type_=Text, nullable=True)
    is_winner: Mapped[bool] = mapped_column(type_=Boolean, nullable=True, default=False)
    is_dismissed: Mapped[bool] = mapped_column(type_=Boolean, nullable=True, default=False)
    authorization_letter: Mapped[str]  = mapped_column(type_=Text, nullable=True)
    is_verified: Mapped[bool]  = mapped_column(type_=Boolean, nullable=True, default=False)
    consumer: Mapped[ConsumerMeter] = relationship("ConsumerMeter", back_populates="agma")