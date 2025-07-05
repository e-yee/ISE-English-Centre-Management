from typing import TYPE_CHECKING
from app.models import Base
from sqlalchemy import ForeignKeyConstraint, Index, String, Date, Integer, text
from sqlalchemy.orm import Mapped, mapped_column, relationship
import datetime

if TYPE_CHECKING:
    from app.models import Employee, Room, StudentAttendance

class MakeupClass(Base):
    __tablename__ = 'makeup_class'
    __table_args__ = (
        ForeignKeyConstraint(['room_id'], ['room.id'], name='FK_makeup_class_room'),
        ForeignKeyConstraint(['student_id', 'class_session_id', 'class_id', 'class_date', 'term'], ['student_attendance.student_id', 'student_attendance.class_session_id', 'student_attendance.class_id', 'student_attendance.class_date', 'student_attendance.term'], name='FK_makeup_class_student_attendance'),
        ForeignKeyConstraint(['teacher_id'], ['employee.id'], name='FK_makeup_class_employee'),
        Index('FK_makeup_class_employee', 'teacher_id'),
        Index('FK_makeup_class_room', 'room_id'),
        Index('FK_makeup_class_student_attendance', 'student_id', 'class_session_id', 'class_id', 'class_date', 'term')
    )

    id: Mapped[str] = mapped_column(String(10), primary_key=True)
    student_id: Mapped[str] = mapped_column(String(10))
    class_session_id: Mapped[str] = mapped_column(String(10))
    class_id: Mapped[str] = mapped_column(String(10))
    class_date: Mapped[datetime.date] = mapped_column(Date)
    term: Mapped[int] = mapped_column(Integer)
    teacher_id: Mapped[str] = mapped_column(String(10))
    room_id: Mapped[str] = mapped_column(String(10))
    created_date: Mapped[datetime.date] = mapped_column(Date, server_default=text('curdate()'))

    room: Mapped['Room'] = relationship('Room', back_populates='makeup_class')
    student_attendance: Mapped['StudentAttendance'] = relationship('StudentAttendance', back_populates='makeup_class')
    teacher: Mapped['Employee'] = relationship('Employee', back_populates='makeup_class')
