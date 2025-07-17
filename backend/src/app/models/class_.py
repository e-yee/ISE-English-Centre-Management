from typing import List, TYPE_CHECKING
from extensions import db
from sqlalchemy import CheckConstraint, Date, DateTime, ForeignKeyConstraint, Index, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
import datetime

if TYPE_CHECKING:
    from app.models import Course, Room, Employee, StudentAttendance
    
class Class(db.Model):
    __tablename__ = 'class'
    __table_args__ = (
        CheckConstraint('term IN (1, 2)', name='CHK_class_term'),
        ForeignKeyConstraint(['course_id', 'course_date'], ['course.id', 'course.created_date'], name='FK_class_course'),
        ForeignKeyConstraint(['room_id'], ['room.id'], name='FK_class_room'),
        ForeignKeyConstraint(['teacher_id'], ['employee.id'], name='FK_class_employee'),
        Index('FK_class_course', 'course_id', 'course_date'),
        Index('FK_class_employee', 'teacher_id'),
        Index('FK_class_room', 'room_id')
    )

    id: Mapped[str] = mapped_column(String(10), primary_key=True)
    course_id: Mapped[str] = mapped_column(String(10), primary_key=True)
    course_date: Mapped[datetime.date] = mapped_column(Date, primary_key=True)
    term: Mapped[int] = mapped_column(Integer, primary_key=True)
    teacher_id: Mapped[str] = mapped_column(String(10), nullable=False)
    room_id: Mapped[str] = mapped_column(String(10), nullable=False)
    class_date: Mapped[datetime.datetime] = mapped_column(DateTime, nullable=False)

    course: Mapped['Course'] = relationship('Course', back_populates='class_', uselist=False)
    room: Mapped['Room'] = relationship('Room', back_populates='class_', uselist=False)
    teacher: Mapped['Employee'] = relationship('Employee', back_populates='class_', uselist=False)
    student_attendance: Mapped[List['StudentAttendance']] = relationship('StudentAttendance', back_populates='class_')
