from typing import List, TYPE_CHECKING
from app.models import Base
from sqlalchemy import CheckConstraint, Date, DateTime, ForeignKeyConstraint, Index, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
import datetime

if TYPE_CHECKING:
    from app.models import Class, Room, Employee, StudentAttendance
    
class ClassSession(Base):
    __tablename__ = 'class_session'
    __table_args__ = (
        CheckConstraint('term IN (1, 2)', name='CHK_class_session_term'),
        ForeignKeyConstraint(['class_id', 'class_date'], ['class.id', 'class.created_date'], name='FK_class_session_class'),
        ForeignKeyConstraint(['room_id'], ['room.id'], name='FK_class_session_room'),
        ForeignKeyConstraint(['teacher_id'], ['employee.id'], name='FK_class_session_employee'),
        Index('FK_class_session_class', 'class_id', 'class_date'),
        Index('FK_class_session_employee', 'teacher_id'),
        Index('FK_class_session_room', 'room_id')
    )

    id: Mapped[str] = mapped_column(String(10), primary_key=True)
    class_id: Mapped[str] = mapped_column(String(10), primary_key=True)
    class_date: Mapped[datetime.date] = mapped_column(Date, primary_key=True)
    term: Mapped[int] = mapped_column(Integer, primary_key=True)
    teacher_id: Mapped[str] = mapped_column(String(10), nullable=False)
    room_id: Mapped[str] = mapped_column(String(10), nullable=False)
    session_date: Mapped[datetime.datetime] = mapped_column(DateTime, nullable=False)

    class_: Mapped['Class'] = relationship('Class', back_populates='class_session', uselist=False)
    room: Mapped['Room'] = relationship('Room', back_populates='class_session', uselist=False)
    teacher: Mapped['Employee'] = relationship('Employee', back_populates='class_session', uselist=False)
    student_attendance: Mapped[List['StudentAttendance']] = relationship('StudentAttendance', back_populates='class_session')
