from __future__ import annotations
from sqlalchemy import Text, Integer, ForeignKey, Float
from sqlalchemy.orm import relationship, Mapped, mapped_column
from geoalchemy2 import Geometry
from geoalchemy2.elements import WKBElement
from .....db.base import BaseModel
from typing import TYPE_CHECKING, List

if TYPE_CHECKING:
    from ...distribution_lines.models.primary_lines import PrimaryLines
    from ...distribution_transformer.model.transformer import TransformerLinebushing


class ConductorWires(BaseModel):
    __tablename__ = "conductor_wires"
    __table_args__ = {"schema": "gis"}
    id: Mapped[int] = mapped_column(primary_key=True)
    type: Mapped[str] = mapped_column(Text, nullable=False)
    size: Mapped[str] = mapped_column(Text, nullable=False)
    unit: Mapped[str] = mapped_column(Text, nullable=False)
    strand: Mapped[str] = mapped_column(Text, nullable=False)
    diameter_inch: Mapped[float] = mapped_column(Float, nullable=False)
    gmr_ft: Mapped[float] = mapped_column(Float, nullable=False)
    x_ohms_miles: Mapped[float] = mapped_column(Float, nullable=False)
    ampacity: Mapped[float] = mapped_column(Float, nullable=False)

    primary_lines: Mapped[List["PrimaryLines"]] = relationship(
        "PrimaryLines", back_populates="conductor")
    linebushing: Mapped[List["TransformerLinebushing"]] = relationship(
        "TransformerLinebushing", back_populates="conductor")
    

class NeutralConcentricCable(BaseModel):
    __tablename__ = "neutral_concentric_cable"
    __table_args__ = {"schema": "gis"}
    id: Mapped[int] = mapped_column(primary_key=True)
    type: Mapped[str] = mapped_column(Text, nullable=False)
    size: Mapped[str] = mapped_column(Text, nullable=False)
    unit: Mapped[str] = mapped_column(Text, nullable=False)
    strand: Mapped[str] = mapped_column(Text, nullable=False)
    full_one_third_neutral: Mapped[str] = mapped_column(Text, nullable=False)
    kv: Mapped[int] = mapped_column(Integer, nullable=False)
    diameter_over_insulation_inch: Mapped[float] = mapped_column(
        Float, nullable=False)
    diameter_over_screen_inch: Mapped[float] = mapped_column(
        Float, nullable=False)
    outside_diameter_inc: Mapped[float] = mapped_column(Float, nullable=False)
    no_copper_neutral: Mapped[int] = mapped_column(Integer, nullable=False)
    size_copper_neutral: Mapped[int] = mapped_column(Integer, nullable=False)
    ampacity: Mapped[int] = mapped_column(Integer, nullable=False)

    primary_lines: Mapped[List["PrimaryLines"]] = relationship(
        "PrimaryLines", back_populates="neutral")
    