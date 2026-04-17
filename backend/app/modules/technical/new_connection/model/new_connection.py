from __future__ import annotations
from sqlalchemy import Integer, ForeignKey, Date, DateTime, func, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
from geoalchemy2 import Geometry,WKBElement
from datetime import date
from .....db.base import BaseModel
from typing import TYPE_CHECKING, List

if TYPE_CHECKING:
    from ....forms.model.form import CompanyForm


# FORM AND TABLE FOR NEW CONNECTIONS 
class NewConnection (BaseModel):
    __tablename__ = "new_connection"
    __table_args__ = {"schema": "technical_dep"}
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True, type_=Integer)
    form_id: Mapped[int] = mapped_column(ForeignKey("form.id", ondelete="CASCADE", onupdate="CASCADE"), type_=Integer , nullable=False)
    times_tamped: Mapped[int] = mapped_column(type_=DateTime(timezone=True), nullable=False, default=func.now())
    date_accomplished: Mapped[date] = mapped_column(type_=Date, nullable=False)
    account_no: Mapped[str] = mapped_column(type_=Text, nullable=True)
    consumer_name: Mapped[str] = mapped_column(type_=Text, nullable=False)
    location: Mapped[str] = mapped_column(type_=Text, nullable=False)
    meter_serial_no: Mapped[str] = mapped_column(type_=Text, nullable=False)
    meter_brand: Mapped[str] = mapped_column(type_=Text, nullable=False)
    meter_sealed: Mapped[str] = mapped_column(type_=Text, nullable=False)
    initial_reading: Mapped[int] = mapped_column(type_=Integer, nullable=False)
    multiplier: Mapped[int] = mapped_column(type_=Integer, nullable=True)
    remarks: Mapped[str] = mapped_column(type_=Text, nullable=True)
    
    accomplished_by: Mapped[str] = mapped_column(type_=Text, nullable=True)
    geom: Mapped[WKBElement] = mapped_column(type_=Geometry(geometry_type="POINT", srid=4326))
    

    # Relationship
    form: Mapped["CompanyForm"] = relationship(back_populates="new_connections")
    images: Mapped[List["NewConnectionImage"]] = relationship(back_populates="new_connection", cascade="all, delete-orphan")

class NewConnectionImage(BaseModel):
    __tablename__ = "new_connection_image"
    __table_args__ = {"schema": "technical_dep"}
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True, type_=Integer)
    new_connection_id: Mapped[int] = mapped_column(ForeignKey("technical_dep.new_connection.id", ondelete="CASCADE", onupdate="CASCADE"), type_=Integer , nullable=False)
    image: Mapped[str] = mapped_column(type_=Text, nullable=False)
    
    # Relationship
    new_connection: Mapped["NewConnection"] = relationship(back_populates="images")