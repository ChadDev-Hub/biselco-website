from __future__ import annotations
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, ForeignKey, DateTime, func, Text, Boolean, Enum, Numeric, Date, UUID, Float
from geoalchemy2 import Geometry, WKBElement
from datetime import date, datetime
from ....db.base import BaseModel
from typing import Literal, List, TYPE_CHECKING
from ...gis.franchise_area import Village, Municipality
import uuid

if TYPE_CHECKING:
    from ...gis.wires.model.conductor_wires import ConductorWires, NeutralConcentricCable
    

class Construction(BaseModel):
    __tablename__ = "construction"
    __table_args__ = {"schema": "construction"}
    id: Mapped[int] = mapped_column(
        primary_key=True, autoincrement=True, type_=Integer)
    uuid: Mapped[uuid.UUID] = mapped_column(
        type_=UUID(), unique=True, default=uuid.uuid4)
    form_id: Mapped[int] = mapped_column(ForeignKey(
        "form.id", ondelete="CASCADE", onupdate="CASCADE"), type_=Integer, nullable=False)
    activity: Mapped[str] = mapped_column(type_=Text, nullable=False)
    description: Mapped[str] = mapped_column(type_=Text, nullable=False)
    date_accomplished: Mapped[date] = mapped_column(type_=Date, nullable=False)
    timestamp: Mapped[int] = mapped_column(type_=DateTime(
        timezone=True), nullable=False, default=func.now())
    
    
    
    
    # RELATIONSHIP
    
    lines: Mapped[List["LineConstruction"]] = relationship(
        back_populates="construction_activity", cascade="all, delete-orphan")
    transformers: Mapped[List["TransformerInstallation"]] = relationship(
        back_populates="construction_activity", cascade="all, delete-orphan")
    manpower_status: Mapped[List["ManpowerStatus"]] = relationship(
        back_populates="construction_activity", cascade="all, delete-orphan")
    vehicle_report: Mapped[List["VehicleReport"]] = relationship(
        back_populates="construction_activity", cascade="all, delete-orphan")
    
    
    # RELATIONSHIP
# ATTENDANCE STATUS
class AttendanceStatus(BaseModel):
    __tablename__ = "attendance_status"
    __table_args__ = {"schema": "construction"}
    id: Mapped[int] = mapped_column(
        primary_key=True, autoincrement=True, type_=Integer)
    status: Mapped[Literal['Present', 'Absent', 'On Leave', 'Trainings / Seminars', 'Other']]
    
    # RELATIONSHIP
    
    manpower_status: Mapped[List["ManpowerStatus"]] = relationship(
        back_populates="attendance_status", cascade="all, delete-orphan")

# MANPOWER STATUS
class ManpowerStatus(BaseModel):
    __tablename__ = "man_power_status"
    __table_args__ = {"schema": "construction"}
    id: Mapped[int] = mapped_column(
        primary_key=True, autoincrement=True, type_=Integer)
    construction_id: Mapped[int] = mapped_column(ForeignKey(
        "construction.construction.id", ondelete="CASCADE", onupdate="CASCADE"), type_=Integer, nullable=False)
    assigned_personnel: Mapped[str]
    attendance_status_id: Mapped[int] = mapped_column(ForeignKey("construction.attendance_status.id"), type_=Integer, nullable=False)
    reason_of_absence: Mapped[str]
    
    # relationship
    construction_activity: Mapped["Construction"] = relationship(
        back_populates="manpower_status"
    )
    attendance_status: Mapped["AttendanceStatus"] = relationship(
        back_populates="manpower_status"
    )
# VEHICLE REPORT
class VehicleReport(BaseModel):
    __tablename__ = "vehicle_report"
    __table_args__ = {"schema": "construction"}
    id: Mapped[int] = mapped_column(
        primary_key=True, autoincrement=True, type_=Integer)
    construction_id: Mapped[int] = mapped_column(ForeignKey(
        "construction.construction.id", ondelete="CASCADE", onupdate="CASCADE"), type_=Integer, nullable=False)
    vehicle_name: Mapped[str]
    mileage_start: Mapped[float]
    mileage_end: Mapped[float]
    
    # relationship
    construction_activity: Mapped["Construction"] = relationship(
        back_populates="vehicle_report"
    )
    

# LINE CONSTRUCTION
class LineConstruction(BaseModel):
    """
    __Line Construction__
    
    Database Table Model for New Distribution Lines or Distribution Line Extension.
    
    __Fields__:
        - id (int): Primary Key
        - uuid (uuid): Unique Identification For classifying The User Inputs data
        - construction_id (int): Construction Connection
        - type Literal['Line Extension', 'New Line']: Kind of Line Construction
        - line_type (Literal['Primary', 'Secondary', 'Underbuilt']): Line Construction Type
        - phasing (str): Line Phasing such as:
            - ABCN for Three Phase.
            - AN, CN, BN for Single Phase.
            - ACN, BCN, CAN, BAN for Vphase.
        - pole_assembly: Pole Construction Assembly
        - conductor: Doctor_id connected to conductor wire table
        - neutral: Neutral Wire Id 
       
    """
    __tablename__ = "line_construction"
    __table_args__ = {"schema": "construction"}
    id: Mapped[int] = mapped_column(
        primary_key=True, autoincrement=True, type_=Integer)
    uuid: Mapped[uuid.UUID] = mapped_column(
        type_=UUID(), unique=True, default=uuid.uuid4)
    construction_id: Mapped[int] = mapped_column(ForeignKey(
        "construction.construction.id", ondelete="CASCADE", onupdate="CASCADE"), type_=Integer, nullable=True)
    type: Mapped[str] = mapped_column(type_=Text, nullable=False)
    line_type: Mapped[Literal["Primary", "Secondary", "Underbuilt"]]
    phasing: Mapped[str] = mapped_column(type_=Text, nullable=False)
    pole_assembly: Mapped[str] = mapped_column(type_=Text, nullable=True)
    conductor: Mapped[int] = mapped_column(ForeignKey(
        "gis.conductor_wires.id", ondelete="CASCADE", onupdate="CASCADE"), type_=Integer, nullable=False)
    neutral: Mapped[int] = mapped_column(ForeignKey(
        "gis.neutral_concentric_cable.id", ondelete="CASCADE", onupdate="CASCADE"), type_=Integer, nullable=True)

    geometry: Mapped[WKBElement] = mapped_column(
        type_=Geometry(geometry_type="LINESTRING", srid=4326))
    municipality_id:Mapped[int]  = mapped_column(ForeignKey('gis.municipality.id'))
    village_id:Mapped[int] = mapped_column(ForeignKey("gis.villages.id"))
    is_synced: Mapped[bool] = mapped_column(type_=Boolean, default=False)
    datetime_synced: Mapped[datetime] = mapped_column(
        type_=DateTime(timezone=True), nullable=True)
    is_deleted: Mapped[bool] = mapped_column(type_=Boolean, default=False)
    datetime_deleted: Mapped[datetime] = mapped_column(
        type_=DateTime(timezone=True), nullable=True)
    date: Mapped[date] = mapped_column(type_=Date, nullable=True)
    pct_acc: Mapped[float] = mapped_column(type_=Float, nullable=True)
    
    
    # RELATIONSHIP
    images: Mapped[List["LineConstructionImage"]] = relationship(
        "LineConstructionImage", back_populates="line_construction", cascade="all, delete")
    
    construction_activity: Mapped[Construction] = relationship(
        back_populates="lines")
    neutral_wire: Mapped[NeutralConcentricCable] = relationship(
        back_populates="line_constructions")
    conductor_wire: Mapped[ConductorWires] = relationship(
        back_populates="line_constructions")
    village: Mapped["Village"] = relationship(
        back_populates="line_constructions"
    )
    municipal:Mapped["Municipality"] = relationship(
        back_populates="line_constructions"
    )
    # RELATIONSHIP

# LINE CONSTRUCTION IMAGE
class LineConstructionImage(BaseModel):
    __tablename__="line_construction_image"
    __table_args__={
        "schema" : "construction"
    }
    id:Mapped[int] = mapped_column(primary_key=True)
    line_construction_id:Mapped[int] = mapped_column(ForeignKey("construction.line_construction.id"), type_=Integer, nullable=False)
    image: Mapped[str]
    image_hash:Mapped[str]
    
    line_construction:Mapped["LineConstruction"] = relationship(back_populates="images")
    
    

class TransformerInstallation(BaseModel):
    __tablename__ = 'transformer_installation'
    __table_args__ = {"schema": "construction"}
    id: Mapped[int] = mapped_column(
        primary_key=True, autoincrement=True, type_=Integer)
    uuid: Mapped[uuid.UUID] = mapped_column(type_=UUID(), unique=True)
    construction_id: Mapped[int] = mapped_column(ForeignKey(
        "construction.construction.id", ondelete="CASCADE", onupdate="CASCADE"), type_=Integer, nullable=False)
    type: Mapped[str] = mapped_column(type_=Text, nullable=False)
    use_type: Mapped[Literal["Sole", "Distribution"]]
    phasing: Mapped[str] = mapped_column(type_=Text, nullable=False)
    kva_rating: Mapped[str] = mapped_column(
        type_=Numeric(precision=10, scale=2), nullable=False)
    image: Mapped[str] = mapped_column(type_=Text, nullable=True)
    geometry: Mapped[WKBElement] = mapped_column(
        type_=Geometry(geometry_type="POINT", srid=4326))
    village_id:Mapped[int] = mapped_column(ForeignKey("gis.villages.id"))
    municipality_id: Mapped[int] = mapped_column(ForeignKey("gis.municipality.id"))
    is_synced: Mapped[bool] = mapped_column(type_=Boolean, default=False)
    datetime_synced: Mapped[datetime] = mapped_column(
        type_=DateTime(timezone=True), nullable=True)
    is_deleted: Mapped[bool] = mapped_column(type_=Boolean, default=False)
    datetime_deleted: Mapped[datetime] = mapped_column(
        type_=DateTime(timezone=True), nullable=True)
    date: Mapped[date] = mapped_column(type_=Date, nullable=True)
    pct_acc: Mapped[float] = mapped_column(type_=Float, nullable=True)
    
    # RELATIONSHIP
    construction_activity: Mapped["Construction"] = relationship(
            back_populates="transformers")
    village: Mapped["Village"] = relationship(
        back_populates="transformer_installation"
    )
    municipal:Mapped["Municipality"] = relationship(
        back_populates="transformer_installation"
    )


# TRANSFORMER INSTALLATION IMAGE
class TransformerInstallationImage(BaseModel):
    __tablename__="transformer_installation_image"
    __table_args__={
        "schema" : "construction"
    }
    id:Mapped[int] = mapped_column(primary_key=True)
    transformer_installation_id:Mapped[int] = mapped_column(ForeignKey("construction.transformer_installation.id"), type_=Integer, nullable=False)
    image: Mapped[str]
    image_hash:Mapped[str]
    