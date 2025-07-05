from typing import List, Optional, TYPE_CHECKING
from app.models import Base
from sqlalchemy import CheckConstraint, Index, String
from sqlalchemy.dialects.mysql import VARCHAR
from sqlalchemy.orm import Mapped, mapped_column, relationship

if TYPE_CHECKING:
    from app.models import Account, Class, Issue, LeaveRequest, StaffCheckin, ClassSession, Contract, Evaluation, MakeupClass
    
class Employee(Base):
    __tablename__ = 'employee'
    __table_args__ = (
        CheckConstraint("((role = 'Teacher') AND ('teacher_status' IN ('Available', 'Unavailable'))) OR ((role <> 'Teacher') AND (teacher_status IS NULL)))", name='CHK_employee_status'),
        CheckConstraint("role IN ('Teacher', 'Learning Advisor', 'Manager')", name='CHK_employee_role'),
        Index('email', 'email', unique=True),
        Index('phone_number', 'phone_number', unique=True)
    )

    id: Mapped[str] = mapped_column(String(10), primary_key=True)
    full_name: Mapped[str] = mapped_column(VARCHAR(2000))
    email: Mapped[str] = mapped_column(String(320))
    role: Mapped[str] = mapped_column(String(20))
    phone_number: Mapped[Optional[str]] = mapped_column(String(20))
    teacher_status: Mapped[Optional[str]] = mapped_column(String(20))

    account: Mapped[List['Account']] = relationship('Account', back_populates='employee')
    class_: Mapped[List['Class']] = relationship('Class', back_populates='teacher')
    issue: Mapped[List['Issue']] = relationship('Issue', back_populates='teacher')
    leave_request: Mapped[List['LeaveRequest']] = relationship('LeaveRequest', foreign_keys='[LeaveRequest.employee_id]', back_populates='employee')
    leave_request_: Mapped[List['LeaveRequest']] = relationship('LeaveRequest', foreign_keys='[LeaveRequest.substitute_id]', back_populates='substitute')
    staff_checkin: Mapped[List['StaffCheckin']] = relationship('StaffCheckin', back_populates='employee')
    class_session: Mapped[List['ClassSession']] = relationship('ClassSession', back_populates='teacher')
    contract: Mapped[List['Contract']] = relationship('Contract', back_populates='employee')
    evaluation: Mapped[List['Evaluation']] = relationship('Evaluation', back_populates='teacher')
    makeup_class: Mapped[List['MakeupClass']] = relationship('MakeupClass', back_populates='teacher')
