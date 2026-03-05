from __future__ import annotations
from sqlalchemy import Text, Integer, ForeignKey
from sqlalchemy.orm import relationship, Mapped, mapped_column
from geoalchemy2 import Geometry
from geoalchemy2.elements import WKBElement
from .....db.base import BaseModel

from ...franchise_area.model.municipality import Municipality
from ...franchise_area.model.villages import Village

from typing import List, TYPE_CHECKING

if TYPE_CHECKING:
    from ...bus.model.bus import Bus
    from .substation import Substation
class Feeder(BaseModel):
    __tablename__ = "feeder"
    __table_args__ = {'schema': 'gis'}
    id: Mapped[int] = mapped_column(primary_key=True)
    geom: Mapped[WKBElement] = mapped_column(Geometry(geometry_type='Point', srid=4326), nullable=False)
    substation_id: Mapped[str] = mapped_column(ForeignKey(
        "gis.substation.substation_id", ondelete="CASCADE", onupdate="CASCADE"), type_=Text, nullable=True, unique=False)
    feeder_id: Mapped[str] = mapped_column(type_=Text, nullable=False, unique=True)
    description: Mapped[str] = mapped_column(type_=Text, nullable=True)
    village_id: Mapped[str] = mapped_column(type_=Integer, nullable=False)
    municipal_id: Mapped[str] = mapped_column(type_=Integer, nullable=False)
    is_active: Mapped[bool] = mapped_column(type_=Text, nullable=True)
    
    # RELATIONSHIPS
    # ONE TO ONE RELATIONSHIP ON BUS
    buses: Mapped[List["Bus"]] = relationship("Bus", back_populates="feeder")
    substation: Mapped["Substation"] = relationship("Substation", back_populates="feeder")
    # FRANCHISE AREA REALTIONSHIPS
    village: Mapped["Village"] = relationship("Village", back_populates="feeders")
    municipal: Mapped["Municipality"] = relationship("Municipality", back_populates="feeders")
    