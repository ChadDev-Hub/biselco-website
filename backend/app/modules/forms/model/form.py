from __future__ import annotations
from sqlalchemy import Integer, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
from ....db.base import BaseModel
from typing import TYPE_CHECKING, List
from ...technical.model.consumer_meter import NewConnection
from ...technical.change_meter.model.change_meter import ChangeMeter

if TYPE_CHECKING:
    from ...departments.model.departments import Departments
    
class CompanyForm(BaseModel):
    __tablename__= "form"
    id: Mapped[int] = mapped_column(primary_key=True, type_=Integer, autoincrement=True)
    department_id: Mapped[int] = mapped_column(ForeignKey("departments.id", ondelete="CASCADE", onupdate="CASCADE"), type_=Integer , nullable=False)
    form_name: Mapped[str] = mapped_column(type_=Text, nullable=False, unique=True)
    form_description: Mapped[str] = mapped_column(type_=Text, nullable=False)
    
    # RELATIONSHIP
    department: Mapped["Departments"] = relationship(back_populates="forms")
    new_connections: Mapped[List["NewConnection"]] = relationship(back_populates="form", cascade="all, delete-orphan")
    change_meters: Mapped[List["ChangeMeter"]] = relationship(back_populates="form", cascade="all, delete-orphan")
    
    
