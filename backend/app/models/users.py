from __future__ import annotations
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import Integer, Text, Boolean
from ..db.base import BaseModel
from typing import List, TYPE_CHECKING
import uuid

if TYPE_CHECKING:
    from .meters import MeterAccount
    from .complaints import Complaints
    from .roles import Roles
    from .news import News
class Users(BaseModel):
    
    '''
    This Table Represent user account registered for the app.
    ### TABLE ATTRIBUTES
    #### Columns:
        - id: the primary key column
        - name: user registered name
        - email: user used email
        - password: user password 
    '''
    
    __tablename__ = "users_account"
    id:Mapped[uuid.UUID] = mapped_column(type_=UUID(), primary_key=True, unique=True, default=uuid.uuid4)
    first_name:Mapped[str] = mapped_column(type_=Text)
    last_name:Mapped[str] = mapped_column(type_=Text)
    email: Mapped[str] = mapped_column(type_=Text, unique=True)
    user_name:Mapped[str] = mapped_column(type_=Text, unique=True, nullable=True)
    password: Mapped[str] = mapped_column(type_=Text, nullable=True)
    is_active: Mapped[bool] = mapped_column(type_=Boolean, default=True)
    photo: Mapped[str] = mapped_column(type_=Text, nullable=True)
    
    meters: Mapped[List['MeterAccount']] = relationship(back_populates="user", cascade="all, delete-orphan")
    complaints: Mapped[List['Complaints']] = relationship(back_populates="user", cascade="all, delete-orphan")
    roles: Mapped[List["Roles"]] = relationship(back_populates="users", secondary="user_roles")
    news: Mapped[List["News"]] = relationship(back_populates="user")
    
