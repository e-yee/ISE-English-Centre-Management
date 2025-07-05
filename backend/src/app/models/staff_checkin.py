from typing import Optional, TYPE_CHECKING
from app.models import Base
from sqlalchemy import CheckConstraint, ForeignKeyConstraint, Index, String, DateTime, text
from sqlalchemy.orm import Mapped, mapped_column, relationship
import datetime

if TYPE_CHECKING:
    from app.models import Employee

class StaffCheckin(Base):
    __tablename__ = 'staff_checkin'
    __table_args__ = (
        CheckConstraint('TO_DAYS(checkout_time) - TO_DAYS(checkin_time) >= 0', name='CHK_staff_checkin_datetime'),
        CheckConstraint("status IN ('Not Checked In', 'Checked In', 'Late'))", name='CHK_staff_checkin_status'),
        ForeignKeyConstraint(['employee_id'], ['employee.id'], name='FK_staff_checkin_employee'),
        Index('FK_staff_checkin_employee', 'employee_id')
    )

    id: Mapped[str] = mapped_column(String(10), primary_key=True)
    employee_id: Mapped[str] = mapped_column(String(10))
    status: Mapped[str] = mapped_column(String(200), server_default=text("'Not Checked In'"))
    checkin_time: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime)
    checkout_time: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime)

    employee: Mapped['Employee'] = relationship('Employee', back_populates='staff_checkin')