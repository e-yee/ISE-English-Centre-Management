from typing import TYPE_CHECKING
from extensions import db
from sqlalchemy import CheckConstraint, Date, ForeignKeyConstraint, Index, Integer, String, text
from sqlalchemy.orm import Mapped, mapped_column, relationship
import datetime

if TYPE_CHECKING:
    from app.models import Course, Employee, Enrolment, Student

class Contract(db.Model):
    __tablename__ = 'contract'
    __table_args__ = (
        CheckConstraint('TO_DAYS(end_date) - TO_DAYS(start_date) > 0', name='CHK_contract_date'),
        CheckConstraint("payment_status IN ('In Progress', 'Paid')", name='CHK_contract_status'),
        ForeignKeyConstraint(['course_id', 'course_date'], ['course.id', 'course.created_date'], name='FK_contract_course'),
        ForeignKeyConstraint(['employee_id'], ['employee.id'], name='FK_contract_employee'),
        ForeignKeyConstraint(['student_id'], ['student.id'], name='FK_contract_student'),
        Index('FK_contract_course', 'course_id', 'course_date'),
        Index('FK_contract_employee', 'employee_id'),
        Index('FK_contract_student', 'student_id')
    )

    id: Mapped[str] = mapped_column(String(10), primary_key=True)
    student_id: Mapped[str] = mapped_column(String(10), nullable=False)
    employee_id: Mapped[str] = mapped_column(String(10), nullable=False)
    course_id: Mapped[str] = mapped_column(String(10), nullable=False)
    course_date: Mapped[datetime.date] = mapped_column(Date, nullable=False)
    tuition_fee: Mapped[int] = mapped_column(Integer, nullable=False)
    payment_status: Mapped[str] = mapped_column(String(20), nullable=False, server_default=text("'In Progress'"))
    start_date: Mapped[datetime.date] = mapped_column(Date, nullable=False)
    end_date: Mapped[datetime.date] = mapped_column(Date, nullable=False)

    course: Mapped['Course'] = relationship('Course', back_populates='contract', uselist=False)
    employee: Mapped['Employee'] = relationship('Employee', back_populates='contract', uselist=False)
    student: Mapped['Student'] = relationship('Student', back_populates='contract', uselist=False)
    enrolment: Mapped['Enrolment'] = relationship('Enrolment', back_populates='contract', uselist=False)