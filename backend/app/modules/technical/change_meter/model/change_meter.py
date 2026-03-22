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
    
    

# FORM AND TABLE FOR CHANGE METER
class ChangeMeter(BaseModel):
    __tablename__ = "change_meter"
    __table_args__ = {"schema": "technical_dep"}
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True, type_=Integer)
    form_id: Mapped[int] = mapped_column(ForeignKey("form.id", ondelete="CASCADE", onupdate="CASCADE"), type_=Integer , nullable=False)
    timestamped: Mapped[int] = mapped_column(type_=DateTime(timezone=True), nullable=False, default=func.now())
    date_accomplished: Mapped[date] = mapped_column(type_=Date, nullable=False)
    account_no: Mapped[str] = mapped_column(type_=Text, nullable=True)
    consumer_name: Mapped[str] = mapped_column(type_=Text, nullable=False)
    location: Mapped[str] = mapped_column(type_=Text, nullable=False)
    pull_out_meter: Mapped[str] = mapped_column(type_=Text, nullable=False)
    pull_out_meter_reading: Mapped[int] = mapped_column(type_=Integer, nullable=False)
    new_meter_serial_no: Mapped[str] = mapped_column(type_=Text, nullable=False)
    new_meter_brand: Mapped[str] = mapped_column(type_=Text, nullable=False)
    meter_sealed: Mapped[int] = mapped_column(type_=Integer, nullable=False)
    initial_reading: Mapped[int] = mapped_column(type_=Integer, nullable=False)
    remarks: Mapped[str] = mapped_column(type_=Text, nullable=True)
    accomplished_by: Mapped[str] = mapped_column(type_=Text, nullable=True)
    geom: Mapped[WKBElement] = mapped_column(type_=Geometry(geometry_type="POINT", srid=4326))
    
    # Relationship
    form: Mapped["CompanyForm"] = relationship(back_populates="change_meters")
    images: Mapped[List["ChangeMeterImage"]] = relationship(back_populates="change_meter", cascade="all, delete-orphan")
    
class ChangeMeterImage(BaseModel):
    __tablename__ = "change_meter_image"
    __table_args__ = {"schema": "technical_dep"}
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True, type_=Integer)
    change_meter_id: Mapped[int] = mapped_column(ForeignKey("technical_dep.change_meter.id", ondelete="CASCADE", onupdate="CASCADE"), type_=Integer , nullable=False)
    image: Mapped[str] = mapped_column(type_=Text, nullable=False)
    
    # Relationship
    change_meter: Mapped["ChangeMeter"] = relationship(back_populates="images")
    
    
