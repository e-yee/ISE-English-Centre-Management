from typing import Optional, TYPE_CHECKING
from app.models import Base
from sqlalchemy import CheckConstraint, ForeignKeyConstraint, Index, Date, String, text
from sqlalchemy.orm import Mapped, mapped_column, relationship
import datetime

if TYPE_CHECKING:
    from app.models import Employee, Room, Student

class Issue(Base):
    __tablename__ = 'issue'
    __table_args__ = (
        CheckConstraint(
            "((issue_type = 'Student Behavior') AND (student_id IS NOT NULL) AND (room_id IS NULL)) OR\
            ((issue_type = 'Technical') AND (student_id IS NULL) AND (room_id IS NOT NULL))", name='CHK_issue_student_room'
        ),
        CheckConstraint("issue_type IN ('Student Behavior','Technical')", name='CHK_issue_type'),
        CheckConstraint("status IN ('In Progress', 'Done')", name='CHK_issue_status'),
        ForeignKeyConstraint(['room_id'], ['room.id'], name='FK_issue_room'),
        ForeignKeyConstraint(['student_id'], ['student.id'], name='FK_issue_student'),
        ForeignKeyConstraint(['teacher_id'], ['employee.id'], name='FK_issue_employee'),
        Index('FK_issue_employee', 'teacher_id'),
        Index('FK_issue_room', 'room_id'),
        Index('FK_issue_student', 'student_id')
    )

    id: Mapped[str] = mapped_column(String(10), primary_key=True)
    teacher_id: Mapped[str] = mapped_column(String(10), nullable=False)
    issue_type: Mapped[str] = mapped_column(String(200), nullable=False)
    issue_description: Mapped[str] = mapped_column(String(200), nullable=False)
    status: Mapped[str] = mapped_column(String(20), nullable=False, server_default=text("'In Progress'"))
    reported_date: Mapped[datetime.date] = mapped_column(Date, nullable=False, server_default=text('curdate()'))
    student_id: Mapped[Optional[str]] = mapped_column(String(10))
    room_id: Mapped[Optional[str]] = mapped_column(String(10))

    room: Mapped[Optional['Room']] = relationship('Room', back_populates='issue', uselist=False)
    student: Mapped[Optional['Student']] = relationship('Student', back_populates='issue', uselist=False)
    teacher: Mapped['Employee'] = relationship('Employee', back_populates='issue', uselist=False)