from sqlalchemy import Text, Integer, ForeignKey, Boolean, Date, Numeric, Computed
from sqlalchemy.orm import relationship, Mapped, mapped_column
from geoalchemy2 import Geometry
from geoalchemy2.elements import WKBElement
from .....db.base import BaseModel
from datetime import date
from ...franchise_area.model.villages import Village
from ...franchise_area.model.municipality import Municipality
from ...bus.model.bus import Bus
from ...consumer.model.consumer import ConsumerMeter



class ServiceDrop(BaseModel):
    __tablename__ = "service_drop"
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    geom: Mapped[WKBElement] = mapped_column(Geometry(geometry_type="LINESTRING", srid=4326))
    service_drop_id: Mapped[str] = mapped_column(type_=Text, nullable=False, unique=True)
    from_bus_id: Mapped[str] = mapped_column(ForeignKey("gis.bus.bus_id"), type_=Text, nullable=False)
    to_customer_id: Mapped[str] = mapped_column(ForeignKey("gis.consumer_meter.account_no"), type_=Text, nullable=False)
    phasing: Mapped[str] = mapped_column(type_=Text, nullable=True)
    description: Mapped[str] = mapped_column(type_=Text, nullable=True)
    length_meters_1 : Mapped[float] = mapped_column(Computed("ST_LENGHT(geom::geography)"),type_=Numeric(precision=10, scale=4), nullable=True)
    length_meters_2: Mapped[float] = mapped_column(Computed(30),type_=Numeric(precision=10, scale=4), nullable=True)
    conductor_type: Mapped[int] = mapped_column(ForeignKey("conductor_wires.id", ondelete="CASCADE", onupdate="CASCADE"), type_=Integer, nullable=True)
    village_id: Mapped[int] = mapped_column(ForeignKey("villages.id"), type_=Integer, nukleable=False)
    municipality_id: Mapped[int] = mapped_column(ForeignKey("municipalities.id"), type_=Integer, nukleable=False)
    
    # RELATIONSHIPS
    
    from_bus_id: Mapped["Bus"] = relationship("Bus", back_populates="service_drop")
    to_customer_id: Mapped["ConsumerMeter"] = relationship("ConsumerMeter", back_populates="service_drop")
    conductor_type: Mapped["ConductorWires"] = relationship("ConductorWires", back_populates="service_drop")
    village_id: Mapped["Village"] = relationship("Village", back_populates="service_drop")
    municipality_id: Mapped["Municipality"] = relationship("Municipality", back_populates="service_drop")