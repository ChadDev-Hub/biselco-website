from __future__ import annotations
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, Text, Boolean
from ..db.base import BaseModel
from typing import List, TYPE_CHECKING


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
    id:Mapped[int] = mapped_column(type_=Integer, primary_key=True)
    first_name:Mapped[str] = mapped_column(type_=Text)
    last_name:Mapped[str] = mapped_column(type_=Text)
    user_name:Mapped[str] = mapped_column(type_=Text, unique=True)
    email: Mapped[str] = mapped_column(type_=Text, unique=True)
    password: Mapped[str] = mapped_column(type_=Text)
    is_active: Mapped[bool] = mapped_column(type_=Boolean, default=True)
    
    meters: Mapped[List['MeterAccount']] = relationship(back_populates="user", cascade="all, delete-orphan")
    complaints: Mapped[List['Complaints']] = relationship(back_populates="user", cascade="all, delete-orphan")
    roles: Mapped[List["Roles"]] = relationship(back_populates="users", secondary="user_roles")
    news: Mapped[List["News"]] = relationship(back_populates="user")
    
