from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Integer,ForeignKey
from ..db.base import BaseModel



class UsersRoles(BaseModel):
    '''This Table Represents Many to Many
    Relationship Between users and their Corresponding Rules.
    
    #### Columns:
        user_id:Integer : user table id
        role_id:Integer : role table id
    '''
    __tablename__="user_roles"
    user_id:Mapped[int] = mapped_column(
        ForeignKey("users_account.id", ondelete="CASCADE", onupdate="CASCADE"),
        primary_key=True,
        type_= Integer
    )
    
    role_id:Mapped[int] = mapped_column(
        ForeignKey("roles.id", ondelete="CASCADE", onupdate="CASCADE"),
        primary_key=True,
        type_= Integer
    )
    