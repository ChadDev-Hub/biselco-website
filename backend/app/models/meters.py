from __future__ import annotations
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Text, Integer, Boolean, ForeignKey, DateTime, BIGINT
from ..db.base import BaseModel
from typing import List, TYPE_CHECKING
from datetime import datetime
from sqlalchemy.dialects.postgresql import UUID
if TYPE_CHECKING:
    from .users import Users

class MeterAccount(BaseModel):
    '''
    Represents a user's electric meter account.

    This table stores information about a Member Consumer and their
    associated electric meter account.

    Attributes
    ----------
    __tablename__ : Literal["meter_account"]
        Name of the database table.

    Columns
    -------
    account_no : int
        Assigned account number for the Member Consumer.

    consumer_name : str
        Full name of the Member Consumer owner.

    consumer_type : str
        Type of consumer. Must be one of the following:
        - "Residential"
        - "Commercial"
        - "Industrial"
        - "Government"
        - "Public Building"
    meter_location : str
        Where Meter Installed
        (eg. Village, Brgy)
        
    mobile_no : int
        Mobile number assigned for The Meter
    isactive : bool
        Current status of the account.

    created_at : datetime
        Timestamp when the account was created..
        
    '''
    __tablename__ = "meter_account"
    id:Mapped[int] = mapped_column(type_=Integer,primary_key=True)
    account_no:Mapped[int] = mapped_column(type_=BIGINT,unique=True)
    user_id:Mapped[int] = mapped_column(ForeignKey("users_account.id", ondelete="CASCADE", onupdate="CASCADE"), type_=UUID())
    consumer_name: Mapped[str] = mapped_column(type_=Text)
    consumer_type: Mapped[str] = mapped_column(type_=Text)
    meter_location: Mapped[str] = mapped_column(type_=Text)
    mobile_no: Mapped[str] = mapped_column(type_=Text)
    created_at: Mapped[datetime] = mapped_column(type_=DateTime(timezone=True), nullable=False)
    is_active: Mapped[bool] = mapped_column(type_=Boolean)
    user:Mapped["Users"] = relationship(back_populates="meters")