from sqlalchemy import Integer, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from geoalchemy2 import Geometry
from geoalchemy2.elements import WKBElement
from .....db.base import BaseModel


class PrimaryLines(BaseModel):
    __tablename__ = "primary_lines"
    __table_args__ = {'schema': 'gis'}

    id: Mapped[int] = mapped_column(primary_key=True)
    geom: Mapped[WKBElement] = mapped_column(Geometry(geometry_type='LINESTRING', srid=4326), nullable=False)
    substation_id: Mapped[str] = mapped_column(type_=Text, nullable=False)
    