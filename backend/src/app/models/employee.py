from typing import List, Optional, TYPE_CHECKING
from extensions import db
from sqlalchemy import CheckConstraint, String
from sqlalchemy.dialects.mysql import VARCHAR
from sqlalchemy.orm import Mapped, mapped_column, relationship

if TYPE_CHECKING:
    from app.models import Account, Course, Issue, LeaveRequest, StaffCheckin, Class, Contract, Evaluation, MakeupClass
    
class Employee(db.Model):
    __tablename__ = 'employee'
    __table_args__ = (
        CheckConstraint(
            "((role = 'Teacher') AND (teacher_status IN ('Available', 'Unavailable'))) OR \
            ((role <> 'Teacher') AND (teacher_status IS NULL)))", name='CHK_employee_status'
        ),
        CheckConstraint("role IN ('Teacher', 'Learning Advisor', 'Manager')", name='CHK_employee_role'),
    )

    id: Mapped[str] = mapped_column(String(10), primary_key=True)
    full_name: Mapped[str] = mapped_column(VARCHAR(2000, collation="utf8mb4_0900_ai_ci"), nullable=False)
    email: Mapped[str] = mapped_column(String(320), nullable=False, unique=True)
    nickname: Mapped[str] = mapped_column(String(200))
    philosophy: Mapped[str] = mapped_column(String(200))
    achievements: Mapped[str] = mapped_column(String(200))
    role: Mapped[str] = mapped_column(String(20), nullable=False)
    phone_number: Mapped[Optional[str]] = mapped_column(String(20), unique=True)
    teacher_status: Mapped[Optional[str]] = mapped_column(String(20))

    account: Mapped['Account'] = relationship('Account', back_populates='employee', uselist=False)
    course: Mapped[List['Course']] = relationship('Course', back_populates='learning_advisor')
    issue: Mapped[List['Issue']] = relationship('Issue', back_populates='teacher')
    leave_request: Mapped[List['LeaveRequest']] = relationship('LeaveRequest', foreign_keys='[LeaveRequest.employee_id]', back_populates='employee')
    leave_request_: Mapped[List['LeaveRequest']] = relationship('LeaveRequest', foreign_keys='[LeaveRequest.substitute_id]', back_populates='substitute')
    staff_checkin: Mapped[List['StaffCheckin']] = relationship('StaffCheckin', back_populates='employee')
    class_: Mapped[List['Class']] = relationship('Class', back_populates='teacher')
    contract: Mapped[List['Contract']] = relationship('Contract', back_populates='employee')
    evaluation: Mapped[List['Evaluation']] = relationship('Evaluation', back_populates='teacher')
    makeup_class: Mapped[List['MakeupClass']] = relationship('MakeupClass', back_populates='teacher')
