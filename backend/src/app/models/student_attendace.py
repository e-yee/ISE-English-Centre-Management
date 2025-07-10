from typing import List, TYPE_CHECKING
from extensions import db
from sqlalchemy import CheckConstraint, ForeignKeyConstraint, Index, String, Date, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
import datetime

if TYPE_CHECKING:
    from app.models import ClassSession, Enrolment, MakeupClass, Student

class StudentAttendance(db.Model):
    __tablename__ = 'student_attendance'
    __table_args__ = (
        CheckConstraint("status IN ('Present', 'Absent')", name='CHK_student_attendance_status'),
        ForeignKeyConstraint(
            ['class_session_id', 'class_id', 'class_date', 'term'], 
            ['class_session.id', 'class_session.class_id', 'class_session.class_date', 'class_session.term'], name='FK_student_attendance_class_session'
        ),
        ForeignKeyConstraint(['enrolment_id'], ['enrolment.id'], name='FK_student_attendance_enrolment'),
        ForeignKeyConstraint(['student_id'], ['student.id'], name='FK_student_attendance_student'),
        Index('FK_student_attendance_class_session', 'class_session_id', 'class_id', 'class_date', 'term'),
        Index('FK_student_attendance_enrolment', 'enrolment_id')
    )

    student_id: Mapped[str] = mapped_column(String(10), primary_key=True)
    class_session_id: Mapped[str] = mapped_column(String(10), primary_key=True)
    class_id: Mapped[str] = mapped_column(String(10), primary_key=True)
    class_date: Mapped[datetime.date] = mapped_column(Date, primary_key=True)
    term: Mapped[int] = mapped_column(Integer, primary_key=True)
    enrolment_id: Mapped[str] = mapped_column(String(10), nullable=False)
    status: Mapped[str] = mapped_column(String(20), nullable=False)

    class_session: Mapped['ClassSession'] = relationship('ClassSession', back_populates='student_attendance', uselist=False)
    enrolment: Mapped['Enrolment'] = relationship('Enrolment', back_populates='student_attendance', uselist=False)
    student: Mapped['Student'] = relationship('Student', back_populates='student_attendance', uselist=False)
    makeup_class: Mapped[List['MakeupClass']] = relationship('MakeupClass', back_populates='student_attendance')