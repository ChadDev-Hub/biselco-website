from sqlalchemy import Text, Integer, ForeignKey, Computed, Numeric, Boolean
from sqlalchemy.orm import relationship, Mapped, mapped_column
from geoalchemy2 import Geometry
from geoalchemy2.elements import WKBElement
from .....db.base import BaseModel
from ...bus.model.bus import Bus
from ...distribution_transformer.model.transformer import DistributionTransformer
from ...franchise_area.model.villages import Village
from ...franchise_area.model.municipality import Municipality
from ...wires.model.conductor_wires import ConductorWires


# SECONDARY LINES
class SecondaryLines(BaseModel):
    __tablename__ = "secondary_lines"
    __table_args__ = {'schema': 'gis'}

    id: Mapped[int] = mapped_column(primary_key=True)
    geom: Mapped[WKBElement] = mapped_column(
        Geometry(geometry_type='LINESTRING', srid=4326), nullable=False)
    transformer_id: Mapped[str] = mapped_column(ForeignKey(
        "gis.distribution_transformer.transformer_id"), type_=Text, nullable=True)
    secondary_line_id: Mapped[str] = mapped_column(
        type_=Text, unique=True)
    from_bus_id: Mapped[str] = mapped_column(
        ForeignKey("gis.bus.bus_id"), type_=Text, nullable=False)
    to_bus_id: Mapped[str] = mapped_column(ForeignKey(
        "gis.bus.bus_id"), type_=Text, nullable=False)
    phasing: Mapped[str] = mapped_column(type_=Text, nullable=True)
    description: Mapped[str] = mapped_column(type_=Text, nullable=True)
    length_meters: Mapped[str] = mapped_column(Computed(
        "ST_Length(geom::geography)", persisted=True), type_=Numeric(precision=10, scale=4), nullable=True)
    conductor_type: Mapped[str] = mapped_column(ForeignKey(
        "gis.conductor_wires.id", ondelete="CASCADE", onupdate="CASCADE"), type_=Integer, nullable=True)
    village_id: Mapped[str] = mapped_column(ForeignKey(
        "gis.villages.id", ondelete="CASCADE", onupdate="CASCADE"), type_=Integer, nullable=False)
    municipality_id: Mapped[str] = mapped_column(ForeignKey(
        "gis.municipality.id", ondelete="CASCADE", onupdate="CASCADE"), type_=Integer, nullable=False)
    is_active: Mapped[bool] = mapped_column(type_=Boolean, nullable=True)
    
    # RELATIONSHIPS
    from_bus: Mapped["Bus"] = relationship("Bus", foreign_keys=[from_bus_id], back_populates="sl_outgoing_lines")
    to_bus: Mapped["Bus"] = relationship("Bus", foreign_keys=[to_bus_id], back_populates="sl_incoming_lines")
    conductor: Mapped["ConductorWires"] = relationship("ConductorWires", back_populates="secondary_lines")
    transformer: Mapped["DistributionTransformer"] = relationship("DistributionTransformer", back_populates="secondary_lines")
    village: Mapped["Village"] = relationship("Village", back_populates="secondary_lines")
    municipal: Mapped["Municipality"] = relationship("Municipality", back_populates="secondary_lines")
