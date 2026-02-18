from __future__ import annotations
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer,ForeignKey,Text
from ....db.base import BaseModel
from typing import List, TYPE_CHECKING

if TYPE_CHECKING:
    from .users import Users
    from .permissions import Permissions

class Roles(BaseModel):
    __tablename__="roles"
    id:Mapped[int] = mapped_column(
        primary_key=True, type_=Integer
    )
    name:Mapped[str] = mapped_column(
        type_=Text,
        unique=True
    )
    users: Mapped[list["Users"]] = relationship(
        back_populates="roles",
        secondary="user_roles"
    )
    permissions: Mapped[List["Permissions"]] = relationship(
        back_populates="roles",
        secondary="roles_permission"
    )