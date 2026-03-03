from __future__ import annotations
from sqlalchemy import Text, Integer
from sqlalchemy.orm import relationship, Mapped, mapped_column
from geoalchemy2 import Geometry
from geoalchemy2.elements import WKBElement
from .....db.base import BaseModel
from typing import List, TYPE_CHECKING


if TYPE_CHECKING:
    from .boundary import Boundary
    from .villages import Village
    from ...substation.models.substation import Substation

class Municipality(BaseModel):
    __tablename__ = "municipality"
    __table_args__ = {'schema': 'gis'}
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(type_=Text, nullable=False, unique=True)
    description: Mapped[str] = mapped_column(type_=Text, nullable=True)
    
    # RELATIONSHIPS
    boundaries: Mapped[List["Boundary"]] = relationship("Boundary", back_populates="municipal")
    villages: Mapped[List["Village"]] = relationship("Village", back_populates="municipal")
    substations: Mapped[List["Substation"]] = relationship("Substation", back_populates="municipal")