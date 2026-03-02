from sqlalchemy import Text, Integer, ForeignKey, BIGINT, Computed
from sqlalchemy.orm import relationship, Mapped, mapped_column
from sqlalchemy import func
from geoalchemy2 import Geometry
from geoalchemy2.functions import ST_Area
from geoalchemy2.elements import WKBElement
from .....db.base import BaseModel
from .municipality import Municipality
from .villages import Village

   
    
    
class Boundary(BaseModel):
    __tablename__ = "boundary"
    __table_args__ = {'schema': 'gis'}
    
    id: Mapped[int] = mapped_column(primary_key=True)
    village_id: Mapped[int] = mapped_column(ForeignKey("gis.villages.id", ondelete="CASCADE",onupdate="CASCADE"),type_=Integer,nullable=False)
    municipality_id: Mapped[int] = mapped_column(ForeignKey("gis.municipality.id", ondelete="CASCADE",onupdate="CASCADE"),type_=Integer,nullable=False)
    geom: Mapped[WKBElement] = mapped_column(Geometry(geometry_type='POLYGON', srid=4326), nullable=False, index=True)
    name: Mapped[str] = mapped_column(Text)
    area: Mapped[int] = mapped_column(BIGINT, server_default=Computed("ST_Area(geom::geography)", persisted=True), nullable=True,)
    
    municipal: Mapped["Municipality"] = relationship("Municipality", back_populates="boundaries")
    villages: Mapped["Village"] = relationship("Village", back_populates="boundaries")



