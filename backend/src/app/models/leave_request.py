from typing import TYPE_CHECKING
from extensions import db
from sqlalchemy import CheckConstraint, ForeignKeyConstraint, Index, String, Date, text
from sqlalchemy.orm import Mapped, mapped_column, relationship
import datetime

if TYPE_CHECKING:
    from app.models import Employee

class LeaveRequest(db.Model):
    __tablename__ = 'leave_request'
    __table_args__ = (
        CheckConstraint('TO_DAYS(end_date) - TO_DAYS(start_date) > 0', name='CHK_leave_request_date'),
        CheckConstraint('employee_id <> substitute_id', name='CHK_leave_request_substitute__id'),
        CheckConstraint("status IN ('Approved', 'Not Approved', 'Pending')", name='CHK_leave_request_status'),
        ForeignKeyConstraint(['employee_id'], ['employee.id'], name='FK_employee_id_employee'),
        ForeignKeyConstraint(['substitute_id'], ['employee.id'], name='FK_substitute_id_employee'),
        Index('FK_employee_id_employee', 'employee_id'),
        Index('FK_substitute_id_employee', 'substitute_id')
    )

    id: Mapped[str] = mapped_column(String(10), primary_key=True)
    employee_id: Mapped[str] = mapped_column(String(10), nullable=False)
    substitute_id: Mapped[str] = mapped_column(String(10), nullable=False)
    start_date: Mapped[datetime.date] = mapped_column(Date, nullable=False)
    end_date: Mapped[datetime.date] = mapped_column(Date, nullable=False)
    reason: Mapped[str] = mapped_column(String(200), nullable=False)
    status: Mapped[str] = mapped_column(String(15), nullable=False, server_default=text("'Pending'"))
    created_date: Mapped[datetime.date] = mapped_column(Date, nullable=False, server_default=text('curdate()'))

    employee: Mapped['Employee'] = relationship('Employee', foreign_keys=[employee_id], back_populates='leave_request', uselist=False)
    substitute: Mapped['Employee'] = relationship('Employee', foreign_keys=[substitute_id], back_populates='leave_request_', uselist=False)