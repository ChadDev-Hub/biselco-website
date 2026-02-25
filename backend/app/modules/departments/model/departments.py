from __future__ import annotations
from sqlalchemy import Integer, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
from ....db.base import BaseModel
from typing import List, TYPE_CHECKING

if TYPE_CHECKING:
    from ...forms.model.form import CompanyForm


class Departments(BaseModel):
    __tablename__ = "departments"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(type_=Text, nullable=False, unique=True)
    description: Mapped[str] = mapped_column(type_=Text, nullable=True)
    
    # RELATIONSHIP
    forms: Mapped[List['CompanyForm']] = relationship(back_populates="department", cascade="all, delete-orphan")