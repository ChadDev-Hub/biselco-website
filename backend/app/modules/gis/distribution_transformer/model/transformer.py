from sqlalchemy import Text, Integer, ForeignKey, Numeric, Boolean
from sqlalchemy.orm import relationship, Mapped, mapped_column
from geoalchemy2 import Geometry
from geoalchemy2.elements import WKBElement
from .....db.base import BaseModel
from ...franchise_area.model.villages import Village
from ...franchise_area.model.municipality import Municipality
from ...wires.model.conductor_wires import ConductorWires
from ...bus.model.bus import Bus
from typing import List


class DistributionTransformer(BaseModel):
    __tablename__ = "distribution_transformer"
    __table_args__ = {'schema': 'gis'}
    id: Mapped[int] = mapped_column(primary_key=True)
    geom: Mapped[WKBElement] = mapped_column(
        Geometry(geometry_type='Point', srid=4326), nullable=False)
    transformer_id: Mapped[str] = mapped_column(
        type_=Text, nullable=False, unique=True)
    

    from_primary_bus_id: Mapped[str] = mapped_column(
        ForeignKey("gis.bus.bus_id", ondelete="CASCADE", onupdate="CASCADE"), 
        type_=Text, nullable=True
    )
    primary_phasing: Mapped[str] = mapped_column(type_=Text, nullable=True)
    to_secondary_bus_id: Mapped[str] = mapped_column(
        ForeignKey("gis.bus.bus_id", ondelete="CASCADE", onupdate="CASCADE"),
        type_=Text, nullable=True, unique=True
    )
    secondary_phasing: Mapped[str] = mapped_column(type_=Text, nullable=True)
    description: Mapped[str] = mapped_column(type_=Text, nullable=True)
    installation_type: Mapped[str] = mapped_column(type_=Text, nullable=True)
    connection_code: Mapped[int] = mapped_column(type_=Integer, nullable=True)
    transformer_type: Mapped[int] = mapped_column(ForeignKey(
        "gis.transformer_type.id"), type_=Integer, nullable=True)
    village_id: Mapped[str] = mapped_column(ForeignKey(
        "gis.villages.id"), type_=Integer, nullable=False)
    municipality_id: Mapped[str] = mapped_column(ForeignKey(
        "gis.municipality.id"), type_=Integer, nullable=False)
    remarks: Mapped[str] = mapped_column(type_=Text, nullable=True)
    image: Mapped[str] = mapped_column(type_=Text, nullable=True)
    is_active: Mapped[bool] = mapped_column(type_=Boolean, nullable=True)

    # RELATIONSHIPS
    village: Mapped["Village"] = relationship(
        "Village", back_populates="distribution_transformers")
    municipal: Mapped["Municipality"] = relationship(
        "Municipality", back_populates="distribution_transformers")
    dt_type: Mapped["TransformerType"] = relationship(
        "TransformerType", back_populates="distribution_transformers")
    linebushing: Mapped[List["TransformerLinebushing"]] = relationship(
        "TransformerLinebushing", back_populates="transformer")
    primary_bus: Mapped["Bus"] = relationship(
        "Bus",
        foreign_keys=[from_primary_bus_id],
        back_populates="primary_transformers")
    secondary_bus: Mapped["Bus"] = relationship(
        "Bus",
        foreign_keys=[to_secondary_bus_id],
        back_populates="secondary_transformers")

class TransformerType(BaseModel):
    __tablename__ = "transformer_type"
    __table_args__ = {'schema': 'gis'}
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(type_=Text, nullable=True,)
    kva_rating: Mapped[str] = mapped_column(type_=Text, nullable=True)
    primary_voltage_rating: Mapped[float] = mapped_column(
        type_=Numeric(precision=10, scale=2), nullable=True)
    secondary_voltage_rating: Mapped[float] = mapped_column(
        type_=Numeric(precision=10, scale=2), nullable=True)
    distribution_transformers: Mapped[List["DistributionTransformer"]] = relationship(
        "DistributionTransformer", back_populates="dt_type")


class TransformerLinebushing(BaseModel):
    __tablename__ = "transformer_linebushing"
    __table_args__ = {'schema': 'gis'}
    id: Mapped[int] = mapped_column(primary_key=True)
    geom: Mapped[WKBElement] = mapped_column(
        Geometry(geometry_type='LINESTRING', srid=4326), nullable=False)
    conductor_type: Mapped[str] = mapped_column(ForeignKey(
        "gis.conductor_wires.id"), type_=Integer, nullable=True
    )
    transformer_id: Mapped[str] = mapped_column(ForeignKey(
        "gis.distribution_transformer.transformer_id"), type_=Text, nullable=True
    )
    is_active: Mapped[bool] = mapped_column(type_=Boolean, nullable=True)

    # RELATIONSHIPS
    transformer: Mapped["DistributionTransformer"] = relationship(
        "DistributionTransformer", back_populates="linebushing")
    conductor: Mapped["ConductorWires"] = relationship(
        "ConductorWires", back_populates="linebushing")
