from sqlalchemy.orm import relationship, Mapped, mapped_column
from sqlalchemy import Text, Integer, ForeignKey, Boolean, Date
from geoalchemy2 import Geometry
from geoalchemy2.elements import WKBElement
from .....db.base import BaseModel
from datetime import date
from ...franchise_area.model.villages import Village
from ...franchise_area.model.municipality import Municipality


class ConsumerMeter(BaseModel):
    __tablename__ = "consumer_meter"
    __table_args__ = {"schema": "gis"}
    id: Mapped[int] = mapped_column(primary_key=True)
    geom: Mapped[WKBElement] = mapped_column(Geometry(geometry_type="POINT", srid=4326))
    account_no: Mapped[str] = mapped_column(Text, nullable=True, unique=True)
    account_name: Mapped[str] = mapped_column(Text, nullable=True)
    account_type: Mapped[str] = mapped_column(Text, nullable=True)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    meter_no: Mapped[str] = mapped_column(Text, nullable=True)
    meter_brand: Mapped[str] = mapped_column(Text, nullable=True)
    barcode: Mapped[str] = mapped_column(Text, nullable=True)
    date_installed: Mapped[date] = mapped_column(Date, nullable=True)
    village_id: Mapped[int] = mapped_column(ForeignKey("gis.villages.id", ondelete="CASCADE", onupdate="CASCADE"), type_=Integer, nullable=False)
    municipality_id: Mapped[int] = mapped_column(ForeignKey("gis.municipality.id", ondelete="CASCADE", onupdate="CASCADE"), type_=Integer, nullable=False)
    remarks: Mapped[str] = mapped_column(Text, nullable=True)
    image: Mapped[str] = mapped_column(Text, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=True)
    
    # RELATIONSHIPS
    village: Mapped["Village"] = relationship("Village", back_populates="consumer_meters")
    municipal: Mapped["Municipality"] = relationship("Municipality", back_populates="consumer_meters")
    
    
    
    
    
    
