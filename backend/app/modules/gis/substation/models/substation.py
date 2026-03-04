from __future__ import annotations
from sqlalchemy import Text, Integer, ForeignKey, BIGINT, Computed, Numeric, Boolean
from sqlalchemy.orm import relationship, Mapped, mapped_column
from sqlalchemy import func
from geoalchemy2 import Geometry
from geoalchemy2.functions import ST_Area
from geoalchemy2.elements import WKBElement
from .....db.base import BaseModel
from ...franchise_area.model.villages import Village
from ...franchise_area.model.municipality import Municipality
from ...bus.model.bus import Bus
from typing import List, TYPE_CHECKING

if TYPE_CHECKING:
    from .feeders import Feeder


class Substation(BaseModel):
    __tablename__ = "substation"
    __table_args__ = {'schema': 'gis'}
    id: Mapped[int] = mapped_column(primary_key=True)
    geom: Mapped[WKBElement] = mapped_column(
        Geometry(geometry_type='POINT', srid=4326), nullable=False, index=True)
    substation_id: Mapped[str] = mapped_column(
        type_=Text, nullable=False, unique=True)
    phasing: Mapped[str] = mapped_column(type_=Text, nullable=True)
    description: Mapped[str] = mapped_column(type_=Text, nullable=True)
    generator_type: Mapped[str] = mapped_column(type_=Text, nullable=True)
    voltage_rating_kv: Mapped[float] = mapped_column(
        type_=Numeric(precision=10, scale=4), nullable=True)
    voltage_profile_id: Mapped[str] = mapped_column(type_=Text, nullable=True)
    village_id: Mapped[int] = mapped_column(ForeignKey(
        "gis.villages.id", ondelete="CASCADE", onupdate="CASCADE"), type_=Integer, nullable=False)
    municipal_id: Mapped[int] = mapped_column(ForeignKey(
        "gis.municipality.id", ondelete="CASCADE", onupdate="CASCADE"), type_=Integer, nullable=False)
    is_active: Mapped[bool] = mapped_column(type_=Boolean, nullable=True)
    remarks: Mapped[str] = mapped_column(type_=Text, nullable=True)
    image: Mapped[str] = mapped_column(type_=Text, nullable=True)

    # RELATIONSHIPS
    village: Mapped["Village"] = relationship(
        "Village", back_populates="substations")
    municipal: Mapped["Municipality"] = relationship(
        "Municipality", back_populates="substations")
    buses: Mapped[List["Bus"]] = relationship(
        "Bus", back_populates="substation")
    feeder: Mapped[List["Feeder"]] = relationship(
        "Feeder", back_populates="substation")
