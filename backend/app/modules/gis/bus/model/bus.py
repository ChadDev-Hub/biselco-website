from __future__ import annotations
from sqlalchemy import Text, Integer, ForeignKey, BIGINT, Computed, Numeric, Boolean
from sqlalchemy.orm import relationship, Mapped, mapped_column
from .....db.base import BaseModel
from geoalchemy2 import Geometry
from geoalchemy2.elements import WKBElement
from ...franchise_area.model.villages import Village
from ...franchise_area.model.municipality import Municipality
from typing import TYPE_CHECKING, List
from ...substation.models.feeders import Feeder

if TYPE_CHECKING:
    from ...distribution_lines.models.primary_lines import PrimaryLines
    from ...poles.model.electric_poles import ElectricPoles
    from ...substation.models.substation import Substation
    from ...distribution_transformer.model.transformer import DistributionTransformer


class Bus(BaseModel):
    __tablename__ = "bus"
    __table_args__ = {'schema': 'gis'}
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    # GEMETRY
    geom: Mapped[WKBElement] = mapped_column(
        Geometry(geometry_type='POINT', srid=4326), nullable=False, index=True)

    # FOREIGN KEYS
    pole_id: Mapped[int] = mapped_column(ForeignKey(
        "gis.electric_poles.id"), type_=Integer, nullable=True)
    substation_id: Mapped[str] = mapped_column(ForeignKey(
        "gis.substation.substation_id"), type_=Text, nullable=True)
    feeder_id: Mapped[str] = mapped_column(ForeignKey(
        "gis.feeder.feeder_id", ondelete="CASCADE", onupdate="CASCADE"), type_=Text, nullable=True)

    bus_id: Mapped[str] = mapped_column(
        type_=Text, nullable=False, unique=True)
    description: Mapped[str] = mapped_column(type_=Text, nullable=True)
    nominal_voltage_kv: Mapped[float] = mapped_column(
        type_=Numeric(precision=10, scale=4), nullable=True)
    village_id: Mapped[int] = mapped_column(ForeignKey(
        "gis.villages.id", ondelete="CASCADE", onupdate="CASCADE"), type_=Integer, nullable=False)
    municipal_id: Mapped[int] = mapped_column(ForeignKey(
        "gis.municipality.id", ondelete="CASCADE", onupdate="CASCADE"), type_=Integer, nullable=False)
    remarks: Mapped[str] = mapped_column(type_=Text, nullable=True)
    image: Mapped[str] = mapped_column(type_=Text, nullable=True)
    is_active: Mapped[bool] = mapped_column(type_=Boolean, nullable=True)

    # RELATIONSHIPS
    feeder: Mapped["Feeder"] = relationship("Feeder", back_populates="buses")
    substation: Mapped["Substation"] = relationship(
        "Substation", back_populates="buses")
    pole: Mapped["ElectricPoles"] = relationship(
        "ElectricPoles", back_populates="bus")
    village: Mapped["Village"] = relationship(
        "Village", back_populates="buses")
    municipal: Mapped["Municipality"] = relationship(
        "Municipality", back_populates="buses")
    pl_out_going_lines: Mapped[List["PrimaryLines"]] = relationship(
        "PrimaryLines",
        foreign_keys="PrimaryLines.from_bus_id",
        back_populates="from_bus")
    pl_incoming_lines: Mapped[List["PrimaryLines"]] = relationship(
        "PrimaryLines",
        foreign_keys="PrimaryLines.to_bus_id",
        back_populates="to_bus")
    primary_transformers: Mapped[List["DistributionTransformer"]] = relationship(
        "DistributionTransformer",
        foreign_keys="DistributionTransformer.from_primary_bus_id",
        back_populates="primary_bus")
    secondary_transformers: Mapped[List["DistributionTransformer"]] = relationship(
        "DistributionTransformer",
        foreign_keys="DistributionTransformer.to_secondary_bus_id",
        back_populates="secondary_bus")
