from typing import TYPE_CHECKING
from app.models import Base
from sqlalchemy import CheckConstraint, ForeignKeyConstraint, Index, String, Date, text
from sqlalchemy.dialects.mysql import VARCHAR
from sqlalchemy.orm import Mapped, mapped_column, relationship
import datetime

if TYPE_CHECKING:
    from app.models import Employee

class LeaveRequest(Base):
    __tablename__ = 'leave_request'
    __table_args__ = (
        CheckConstraint('TO_DAYS(end_date) - TO_DAYS(start_date) > 0', name='CHK_leave_request_date'),
        CheckConstraint('employee_id <> substitute_id', name='CHK_leave_request_substitute__id'),
        CheckConstraint("status IN ('Approved', 'Not Approved')", name='CHK_leave_request_status'),
        ForeignKeyConstraint(['employee_id'], ['employee.id'], name='FK_employee_id_employee'),
        ForeignKeyConstraint(['substitute_id'], ['employee.id'], name='FK_substitute_id_employee'),
        Index('FK_employee_id_employee', 'employee_id'),
        Index('FK_substitute_id_employee', 'substitute_id')
    )

    id: Mapped[str] = mapped_column(String(10), primary_key=True)
    employee_id: Mapped[str] = mapped_column(String(10))
    substitute_id: Mapped[str] = mapped_column(String(10))
    start_date: Mapped[datetime.date] = mapped_column(Date)
    end_date: Mapped[datetime.date] = mapped_column(Date)
    reason: Mapped[str] = mapped_column(VARCHAR(200))
    status: Mapped[str] = mapped_column(VARCHAR(15), server_default=text("Not Approved"))
    created_date: Mapped[datetime.date] = mapped_column(Date, server_default=text('curdate()'))

    employee: Mapped['Employee'] = relationship('Employee', foreign_keys=[employee_id], back_populates='leave_request')
    substitute: Mapped['Employee'] = relationship('Employee', foreign_keys=[substitute_id], back_populates='leave_request_')