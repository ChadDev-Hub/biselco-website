from __future__ import annotations
from sqlalchemy import Text, Integer, ForeignKey
from sqlalchemy.orm import relationship, Mapped, mapped_column
from geoalchemy2 import Geometry
from geoalchemy2.elements import WKBElement
from .....db.base import BaseModel
from ...bus.model.bus import Bus
from ...franchise_area.model.municipality import Municipality
from ...franchise_area.model.villages import Village

class Feeder(BaseModel):
    __tablename__ = "feeder"
    __table_args__ = {'schema': 'gis'}
    id: Mapped[int] = mapped_column(primary_key=True)
    bus_id: Mapped[str] = mapped_column(ForeignKey("gis.bus.bus_id"),type_=Text, nullable=False, unique=True)
    geom: Mapped[WKBElement] = mapped_column(Geometry(geometry_type='Point', srid=4326), nullable=False)
    feeder_id: Mapped[str] = mapped_column(type_=Text, nullable=False, unique=True)
    description: Mapped[str] = mapped_column(type_=Text, nullable=True)
    village_id: Mapped[str] = mapped_column(type_=Integer, nullable=False)
    municipal_id: Mapped[str] = mapped_column(type_=Integer, nullable=False)
    is_active: Mapped[bool] = mapped_column(type_=Text, nullable=True)
    
    # RELATIONSHIPS
    # ONE TO ONE RELATIONSHIP ON BUS
    bus: Mapped["Bus"] = relationship("Bus", back_populates="feeder")
    
    # FRANCHISE AREA REALTIONSHIPS
    village: Mapped["Village"] = relationship("Village", back_populates="feeders")
    municipal: Mapped["Municipality"] = relationship("Municipality", back_populates="feeders")
    