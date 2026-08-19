from __future__ import annotations
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, ForeignKey, DateTime, func, Text, Boolean, Enum, Numeric
from geoalchemy2 import Geometry,WKBElement

from .....db.base import BaseModel
from typing import Literal, List, TYPE_CHECKING

if TYPE_CHECKING:
    from ....gis.wires.model.conductor_wires import ConductorWires, NeutralConcentricCable

class Construction(BaseModel):
    __tablename__ = "construction"
    __table_args__ = {"schema": "technical_dep"}
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True, type_=Integer)
    form_id: Mapped[int] = mapped_column(ForeignKey("form.id", ondelete="CASCADE", onupdate="CASCADE"), type_=Integer , nullable=False)
    activity: Mapped[str] = mapped_column(type_=Text, nullable=False)
    timestamped: Mapped[int] = mapped_column(type_=DateTime(timezone=True), nullable=False, default=func.now())
    
    lines: Mapped[List["LineConstruction"]] = relationship(back_populates="construction_activity", cascade="all, delete-orphan")
    transformers: Mapped[List["TransformerInstallation"]] = relationship(back_populates="construction_activity", cascade="all, delete-orphan")
    # RELATIONSHIP
    
class LineConstruction(BaseModel):
    __tablename__ = "line_construction"
    __table_args__ = {"schema": "technical_dep"}
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True, type_=Integer)
    construction_id: Mapped[int] = mapped_column(ForeignKey("technical_dep.construction.id", ondelete="CASCADE", onupdate="CASCADE"), type_=Integer , nullable=True)
    type: Mapped[str] = mapped_column(type_=Text, nullable=False)
    line_type: Mapped[Literal["Primary", "Secondary", "Underbuilt"]] = mapped_column(type_=Enum("primary", "secondary", "underbuilt", name="line_type"))
    phasing: Mapped[str] = mapped_column(type_=Text, nullable=False)
    pole_assembly: Mapped[str] = mapped_column(type_=Text, nullable=False)
    conductor: Mapped[int] = mapped_column(ForeignKey("gis.conductor_wires.id", ondelete="CASCADE", onupdate="CASCADE"), type_=Integer , nullable=False)
    neutral: Mapped[int] = mapped_column(ForeignKey("gis.neutral_concentric_cable.id", ondelete="CASCADE", onupdate="CASCADE"), type_=Integer , nullable=True)
    image: Mapped[str] = mapped_column(type_=Text, nullable=True)
    geometry: Mapped[WKBElement] = mapped_column(type_=Geometry(geometry_type="LINESTRING", srid=4326))
    
    construction_activity: Mapped[Construction] = relationship(back_populates="lines")
    neutral_wire: Mapped[NeutralConcentricCable] = relationship(back_populates="line_constructions")
    conductor_wire: Mapped[ConductorWires] = relationship(back_populates="line_constructions")
    # RELATIONSHIP

class TransformerInstallation(BaseModel):
    __tablename__ = 'transformer_installation'
    __table_args__={"schema": "technical_dep"}
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True, type_=Integer)
    construction_id: Mapped[int] = mapped_column(ForeignKey("technical_dep.construction.id", ondelete="CASCADE", onupdate="CASCADE"), type_=Integer , nullable=False)
    type: Mapped[str] = mapped_column(type_=Text, nullable=False)
    use_type: Mapped[Literal["Sole", "Distribution"]] = mapped_column(type_=Enum("sole", "distribution", name="use_type"))
    phasing: Mapped[str] = mapped_column(type_=Text, nullable=False)
    kva_rating: Mapped[str] = mapped_column(type_=Numeric(precision=10, scale=2), nullable=False)
    image: Mapped[str] = mapped_column(type_=Text, nullable=True)
    geometry: Mapped[WKBElement] = mapped_column(type_=Geometry(geometry_type="POINT", srid=4326))
    
    construction_activity: Mapped["Construction"] = relationship(back_populates="transformers")
    # RELATIONSHIP
    
    