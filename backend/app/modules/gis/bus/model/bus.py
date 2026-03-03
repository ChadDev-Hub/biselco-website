from __future__ import annotations
from sqlalchemy import Text, Integer, ForeignKey, BIGINT, Computed, Numeric, Boolean
from sqlalchemy.orm import relationship, Mapped, mapped_column
from .....db.base import BaseModel
from geoalchemy2 import Geometry
from geoalchemy2.elements import WKBElement
from ...franchise_area.model.villages import Village
from ...franchise_area.model.municipality import Municipality
from typing import TYPE_CHECKING, List


if TYPE_CHECKING:
    from ...substation.models.feeders import Feeder
    from ...distribution_lines.models.primary_lines import PrimaryLines
    from ...poles.model.electric_poles import ElectricPoles

class Bus(BaseModel):
    __tablename__="bus"
    __table_args__ = {'schema': 'gis'}
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    geom: Mapped[WKBElement] = mapped_column(Geometry(geometry_type='POINT', srid=4326), nullable=False, index=True)
    pole_id: Mapped[int] = mapped_column(ForeignKey("gis.electric_poles.id"),type_=Integer, nullable=True)
    bus_id: Mapped[str] = mapped_column(type_=Text, nullable=False, unique=True)
    description: Mapped[str] = mapped_column(type_=Text, nullable=True)
    nominal_voltage_kv: Mapped[float] = mapped_column(type_=Numeric(precision=10, scale=4), nullable=True)
    village_id: Mapped[int] = mapped_column(ForeignKey("gis.villages.id", ondelete="CASCADE",onupdate="CASCADE"),type_=Integer,nullable=False)
    municipal_id: Mapped[int] = mapped_column(ForeignKey("gis.municipality.id", ondelete="CASCADE",onupdate="CASCADE"),type_=Integer,nullable=False)
    substation_id: Mapped[int] = mapped_column(ForeignKey("gis.substation.id", ondelete="CASCADE",onupdate="CASCADE"),type_=Integer,nullable=False)
    remarks: Mapped[str] = mapped_column(type_=Text, nullable=True)
    image: Mapped[str] = mapped_column(type_=Text, nullable=True)
    is_active: Mapped[bool] = mapped_column(type_=Boolean, nullable=True)
    
    # RELATIONSHIPS
    pole: Mapped["ElectricPoles"] = relationship("ElectricPoles", back_populates="bus")
    village: Mapped["Village"] = relationship("Village", back_populates="buses")
    municipal: Mapped["Municipality"] = relationship("Municipality", back_populates="buses")
    feeder: Mapped["Feeder"] = relationship("Feeder", back_populates="bus")
    
    pl_out_going_lines: Mapped[List["PrimaryLines"]] = relationship("PrimaryLines", back_populates="from_bus")
    pl_incoming_lines: Mapped[List["PrimaryLines"]] = relationship("PrimaryLines", back_populates="to_bus")