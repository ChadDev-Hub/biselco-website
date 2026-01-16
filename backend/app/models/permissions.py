from __future__ import annotations
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer,ForeignKey,Text
from ..db.base import BaseModel
from typing import List, TYPE_CHECKING

if TYPE_CHECKING:
    from .roles import Roles
    
class Permissions(BaseModel):
    __tablename__= "permissions"
    id:Mapped[int] = mapped_column(primary_key=True, type_=Integer)
    code:Mapped[str]  = mapped_column(type_=Text,unique=True)
    roles:Mapped[List["Roles"]] = relationship(back_populates="permissions", secondary="roles_permission")