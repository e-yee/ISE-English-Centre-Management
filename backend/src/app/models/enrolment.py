from typing import List, TYPE_CHECKING
from extensions import db
from sqlalchemy import ForeignKeyConstraint, Index, Date, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
import datetime

if TYPE_CHECKING:
    from app.models import Course, Contract, Evaluation, StudentAttendance, Student
    
class Enrolment(db.Model):
    __tablename__ = 'enrolment'
    __table_args__ = (
        ForeignKeyConstraint(
            ['course_id', 'course_date'], 
            ['course.id', 'course.created_date'], name='FK_enrolment_course'
        ),
        ForeignKeyConstraint(['contract_id'], ['contract.id'], name='FK_enrolment_contract'),
        ForeignKeyConstraint(['student_id'], ['student.id'], name='FK_enrolment_student'),
        Index('FK_enrolment_course', 'course_id', 'course_date'),
        Index('FK_enrolment_contract', 'contract_id'),
        Index('FK_enrolment_student', 'student_id')
    )

    id: Mapped[str] = mapped_column(String(10), primary_key=True)
    contract_id: Mapped[str] = mapped_column(String(10), nullable=False)
    student_id: Mapped[str] = mapped_column(String(10), nullable=False)
    course_id: Mapped[str] = mapped_column(String(10), nullable=False)
    course_date: Mapped[datetime.date] = mapped_column(Date, nullable=False)
    enrolment_date: Mapped[datetime.date] = mapped_column(Date, nullable=False)

    course: Mapped['Course'] = relationship('Course', back_populates='enrolment', uselist=False)
    contract: Mapped['Contract'] = relationship('Contract', back_populates='enrolment', uselist=False)
    student: Mapped['Student'] = relationship('Student', back_populates='enrolment', uselist=False)
    evaluation: Mapped['Evaluation'] = relationship('Evaluation', back_populates='enrolment', uselist=False)
    student_attendance: Mapped[List['StudentAttendance']] = relationship('StudentAttendance', back_populates='enrolment')