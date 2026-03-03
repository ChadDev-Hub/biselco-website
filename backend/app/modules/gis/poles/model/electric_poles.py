from sqlalchemy import Text, Integer, ForeignKey, BIGINT, Computed, Numeric
from sqlalchemy.orm import relationship, Mapped, mapped_column
from sqlalchemy import func
from geoalchemy2 import Geometry
from geoalchemy2.functions import ST_Area
from geoalchemy2.elements import WKBElement
from .....db.base import BaseModel
from ...franchise_area.model.villages import Village
from ...franchise_area.model.municipality import Municipality
from ...bus.model.bus import Bus
from typing import List


# ELECTRIC POLES
class ElectricPoles(BaseModel):
    __tablename__ = "electric_poles"
    __table_args__ = {'schema': 'gis'}
    id:Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    geom:Mapped[WKBElement] = mapped_column(Geometry(geometry_type='POINT', srid=4326), nullable=False, index=True)
    pole_id:Mapped[str] = mapped_column(type_=Text, nullable=False, unique=True)
    description:Mapped[str] = mapped_column(Text, nullable=True)
    remarks: Mapped[str] = mapped_column(Text, nullable=True)
    village_id:Mapped[int] = mapped_column(ForeignKey("gis.villages.id", ondelete="CASCADE",onupdate="CASCADE"),type_=Integer,nullable=False)
    municipal_id:Mapped[int] = mapped_column(ForeignKey("gis.municipality.id", ondelete="CASCADE",onupdate="CASCADE"),type_=Integer,nullable=False)
    pole_assembly: Mapped[str] = mapped_column(ForeignKey("gis.pole_assembly.name", ondelete="CASCADE",onupdate="CASCADE"),type_=Text,nullable=True)
    height: Mapped[float] = mapped_column(type_=Numeric(precision=10, scale=4), nullable=True)
    
    bus: Mapped[List["Bus"]] = relationship("Bus", back_populates="pole")
    village: Mapped["Village"] = relationship("Village", back_populates="electric_poles")
    municipal: Mapped["Municipality"] = relationship("Municipality", back_populates="electric_poles")
    assembly: Mapped["PoleAssembly"] = relationship("PoleAssembly", back_populates="poles")
    materials: Mapped[List["PoleMaterial"]] = relationship("PoleMaterial", back_populates="poles")


# POLE CONSTRUCTION
class PoleConstruction(BaseModel):
    __tablename__ = "pole_construction"
    __table_args__ = {'schema': 'gis'}
    id:Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(Text, nullable=False, unique=True)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    remarks: Mapped[str] = mapped_column(Text, nullable=True)
    
    assemblies: Mapped[List["PoleAssembly"]] = relationship("PoleAssembly", back_populates="construction")
    
# POLE ASSEMBLY
class PoleAssembly(BaseModel):
    __tablename__ = "pole_assembly"
    __table_args__ = {'schema': 'gis'}
    id:Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    construction_id: Mapped[int] = mapped_column(ForeignKey("gis.pole_construction.id", ondelete="CASCADE",onupdate="CASCADE"),type_=Integer,nullable=False)
    name: Mapped[str] = mapped_column(Text, nullable=False, unique=True)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    remarks: Mapped[str] = mapped_column(Text, nullable=True)
    
    construction: Mapped["PoleConstruction"] = relationship("PoleConstruction", back_populates="assemblies")
    poles: Mapped[List["ElectricPoles"]] = relationship("ElectricPoles", back_populates="assembly")
    
    
# MANY TO MANY POLE MATERIAL REALATIONSHIP TABLE
class PoleMaterial(BaseModel):
    __tablename__ = "pole_material"
    __table_args__ = {'schema': 'gis'}
    pole_id:Mapped[int] = mapped_column(ForeignKey("gis.electric_poles.id", ondelete="CASCADE",onupdate="CASCADE"),
                                        primary_key=True, type_=Integer,nullable=False)
    material_id:Mapped[int] = mapped_column(ForeignKey("gis.construction_material.id", ondelete="CASCADE",onupdate="CASCADE"),
                                              primary_key=True, type_=Integer,nullable=False)
    quantity: Mapped[int] = mapped_column(type_=Integer, nullable=True)


# CONSTRUCTION MATERIAL TABLE
class ConstructionMaterial(BaseModel):
    __tablename__ = "construction_material"
    __table_args__ = {'schema': 'gis'}
    id:Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(Text, nullable=False, unique=True)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    remarks: Mapped[str] = mapped_column(Text, nullable=True)
    
    assemblies: Mapped[List["PoleAssembly"]] = relationship("PoleAssembly", back_populates="components")
    poles: Mapped[List["ElectricPoles"]] = relationship("ElectricPoles", secondary="pole_material", back_populates="materials")
