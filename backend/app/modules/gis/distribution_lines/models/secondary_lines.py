from sqlalchemy import Text, Integer, ForeignKey
from sqlalchemy.orm import relationship, Mapped, mapped_column
from geoalchemy2 import Geometry
from geoalchemy2.elements import WKBElement
from .....db.base import BaseModel



class SecondaryLines(BaseModel):
    __tablename__ = "secondary_lines"
    __table_args__ = {'schema': 'gis'}

    id: Mapped[int] = mapped_column(primary_key=True)
    geom: Mapped[WKBElement] = mapped_column(Geometry(geometry_type='LINESTRING', srid=4326), nullable=False)
    secondary_line_id: Mapped[str] = mapped_column(type_=Text, nullable=False, unique=True)
    from_bus_id: Mapped[str] = mapped_column(ForeignKey("gis.bus.bus_id"), type_=Text, nullable=False)
    to_bus_id: Mapped[str] = mapped_column(ForeignKey("gis.bus.bus_id"), type_=Text, nullable=False)
    phasing: Mapped[str] = mapped_column(type_=Text, nullable=True)
    df