from __future__ import annotations
from sqlalchemy import Text, Integer, ForeignKey
from sqlalchemy.orm import relationship, Mapped, mapped_column
from geoalchemy2 import Geometry
from geoalchemy2.elements import WKBElement
from .....db.base import BaseModel
from typing import TYPE_CHECKING, List

if TYPE_CHECKING:
    from ...distribution_lines.models.primary_lines import PrimaryLines


class ConductorWires(BaseModel):
    __tablename__ = "conductor_wires"
    __table_args__ = {"schema": "gis"}
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(Text, nullable=False, unique=True)
    
    primary_lines: Mapped[List["PrimaryLines"]] = relationship("PrimaryLines", back_populates="conductor")
    
    