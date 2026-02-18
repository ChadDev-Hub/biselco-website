from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Integer,ForeignKey
from ....db.base import BaseModel


class RolesPermission(BaseModel):
    __tablename__="roles_permission"
    roles_id:Mapped[int] = mapped_column(
        ForeignKey("roles.id", ondelete="CASCADE", onupdate="CASCADE"),
        primary_key=True,
    )
    perm_id:Mapped[int] = mapped_column(
        ForeignKey("permissions.id",
                   onupdate="CASCADE",
                   ondelete="CASCADE"),
        primary_key=True
    )
    