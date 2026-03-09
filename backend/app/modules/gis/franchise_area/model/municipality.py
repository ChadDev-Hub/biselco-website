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
    from ...bus.model.bus import Bus
    from ...distribution_lines.models.primary_lines import PrimaryLines
    from ...distribution_transformer.model.transformer import DistributionTransformer
    from ...substation.models.feeders import Feeder
    from ...poles.model.electric_poles import ElectricPoles
    from ...distribution_lines.models.secondary_lines import SecondaryLines
    from ...consumer.model.consumer import ConsumerMeter
    
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
    buses: Mapped[List["Bus"]] = relationship("Bus", back_populates="municipal")
    primary_lines: Mapped[List["PrimaryLines"]] = relationship("PrimaryLines", back_populates="municipal")
    distribution_transformers: Mapped[List["DistributionTransformer"]] = relationship("DistributionTransformer", back_populates="municipal")
    feeders: Mapped[List["Feeder"]] = relationship("Feeder", back_populates="municipal")
    electric_poles: Mapped[List["ElectricPoles"]] = relationship("ElectricPoles", back_populates="municipal")
    secondary_lines: Mapped[List["SecondaryLines"]] = relationship("SecondaryLines", back_populates="municipal")
    
    consumer_meters: Mapped[List["ConsumerMeter"]] = relationship("ConsumerMeter", back_populates="municipal")
    