from __future__ import annotations
from sqlalchemy import Text, Integer, ForeignKey
from sqlalchemy.orm import relationship, Mapped, mapped_column
from geoalchemy2 import Geometry
from geoalchemy2.elements import WKBElement
from .....db.base import BaseModel
from .municipality import Municipality
from typing import List, TYPE_CHECKING


if TYPE_CHECKING:
    from .boundary import Boundary
    from ...substation.models.substation import Substation
    from ...bus.model.bus import Bus
    from ...distribution_lines.models.primary_lines import PrimaryLines
    from ...distribution_transformer.model.transformer import DistributionTransformer


class Village(BaseModel):
    __tablename__ = "villages"
    __table_args__ = {'schema': 'gis'}
    id: Mapped[int] = mapped_column(primary_key=True)
    municipality_id: Mapped[int] = mapped_column(ForeignKey("gis.municipality.id", ondelete="CASCADE",onupdate="CASCADE"),type_=Integer,nullable=False)
    name: Mapped[str] = mapped_column(type_=Text, nullable=False)
    description: Mapped[str] = mapped_column(type_=Text , nullable=True)
    
    # RELATIONSHIPS
    municipal: Mapped["Municipality"] = relationship("Municipality", back_populates="villages")
    boundaries: Mapped[List["Boundary"]] = relationship("Boundary", back_populates="villages")
    substations: Mapped[List["Substation"]] = relationship("Substation", back_populates="village")
    buses: Mapped[List["Bus"]] = relationship("Bus", back_populates="village")
    primary_lines: Mapped[List["PrimaryLines"]] = relationship("PrimaryLines", back_populates="village")
    distribution_transformers: Mapped[List["DistributionTransformer"]] = relationship("DistributionTransformer", back_populates="village")

    
    