from sqlalchemy import Integer, ForeignKey, Text, DateTime, Date, Time, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from ....db.base import BaseModel
from datetime import datetime
from .complaints import Complaints
from .status_name import ComplaintsStatusName
from ...user.model.users import Users




class ComplaintsStatusHistory(BaseModel):
    __tablename__ = "complaints_status_history"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    complaint_id: Mapped[int] = mapped_column(ForeignKey("consumer_complaints.id"))
    status_id: Mapped[int] = mapped_column(ForeignKey("complaints_status_name.id"))
    user_id: Mapped[int] = mapped_column(ForeignKey("users_account.id"))
    comments: Mapped[str] = mapped_column(Text, nullable=True)
    timestamped: Mapped[DateTime] = mapped_column(DateTime(timezone=True), default=func.now())
    
    
    complaint: Mapped["Complaints"] = relationship(back_populates="status_history")
    status: Mapped["ComplaintsStatusName"] = relationship(back_populates="status_history")
    user: Mapped["Users"] = relationship(back_populates="complaint_status_history")