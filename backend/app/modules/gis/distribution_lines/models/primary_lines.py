from __future__ import annotations
from sqlalchemy import Integer, Text, ForeignKey, Numeric
from sqlalchemy.orm import Mapped, mapped_column, relationship
from geoalchemy2 import Geometry
from geoalchemy2.elements import WKBElement
from .....db.base import BaseModel
from ...bus.model.bus import Bus
from ...franchise_area.model.villages import Village
from ...franchise_area.model.municipality import Municipality  
from ...conductor.model.conductor_wires import ConductorWires
class PrimaryLines(BaseModel):
    __tablename__ = "primary_lines"
    __table_args__ = {'schema': 'gis'}
    id: Mapped[int] = mapped_column(primary_key=True)
    geom: Mapped[WKBElement] = mapped_column(Geometry(geometry_type='LINESTRING', srid=4326), nullable=False)
    substation_id: Mapped[int] = mapped_column(ForeignKey("gis.substation.id"), type_=Integer, nullable=False)
    feeder_id: Mapped[str] = mapped_column(ForeignKey("gis.feeder.feeder_id"),type_=Text, nullable=True)
    primary_line_id: Mapped[str] = mapped_column(type_=Text, nullable=False, unique=True)
    from_bus_id: Mapped[str] = mapped_column(ForeignKey("gis.bus.bus_id"),type_=Text)
    to_bus_id: Mapped[str] = mapped_column(ForeignKey("gis.bus.bus_id"),type_=Text)
    phasing: Mapped[str] = mapped_column(type_=Text, nullable=True)
    description: Mapped[str] = mapped_column(type_=Text, nullable=True)
    system_ground_type: Mapped[str] = mapped_column(type_=Text, nullable=True)
    length_meters: Mapped[float] = mapped_column(type_=Numeric(precision=10, scale=4), nullable=True)
    conductor_wire: Mapped[str] = mapped_column(ForeignKey("gis.conductor_wires.id", ondelete="CASCADE",onupdate="CASCADE"),type_=Integer,nullable=False)
    neutral_wire: Mapped[str] = mapped_column(ForeignKey("gis.conductor_wires.id", ondelete="CASCADE",onupdate="CASCADE"),type_=Integer,nullable=False)
    village_id: Mapped[int] = mapped_column(ForeignKey("gis.villages.id", ondelete="CASCADE",onupdate="CASCADE"),type_=Integer,nullable=False)
    municipality_id: Mapped[int] = mapped_column(ForeignKey("gis.municipality.id", ondelete="CASCADE",onupdate="CASCADE"),type_=Integer,nullable=False)
    
    # RELATIONSHIPS
    from_bus: Mapped["Bus"] = relationship("Bus", foreign_keys=[from_bus_id], back_populates="pl_out_going_lines")
    to_bus: Mapped["Bus"] = relationship("Bus", foreign_keys=[to_bus_id], back_populates="pl_incoming_lines")
    
    conductor: Mapped["ConductorWires"] = relationship("ConductorWires", back_populates="primary_lines")
    neutral: Mapped["ConductorWires"] = relationship("ConductorWires", back_populates="primary_lines")
    village: Mapped["Village"] = relationship("Village", back_populates="primary_lines")
    municipal: Mapped["Municipality"] = relationship("Municipality", back_populates="primary_lines")