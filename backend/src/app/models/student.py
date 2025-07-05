from typing import List, Optional, TYPE_CHECKING
from app.models import Base
from sqlalchemy import String, Date, text
from sqlalchemy.dialects.mysql import VARCHAR
from sqlalchemy.orm import Mapped, mapped_column, relationship
import datetime

if TYPE_CHECKING:
    from app.models import Contract, Enrolment, Evaluation, Issue, StudentAttendance


class Student(Base):
    __tablename__ = 'student'

    id: Mapped[str] = mapped_column(String(10), primary_key=True)
    full_name: Mapped[str] = mapped_column(VARCHAR(2000))
    contact_info: Mapped[str] = mapped_column(String(200))
    created_date: Mapped[datetime.date] = mapped_column(Date, server_default=text('curdate()'))
    date_of_birth: Mapped[Optional[datetime.date]] = mapped_column(Date)

    issue: Mapped[List['Issue']] = relationship('Issue', back_populates='student')
    contract: Mapped[List['Contract']] = relationship('Contract', back_populates='student')
    enrolment: Mapped[List['Enrolment']] = relationship('Enrolment', back_populates='student')
    evaluation: Mapped[List['Evaluation']] = relationship('Evaluation', back_populates='student')
    student_attendance: Mapped[List['StudentAttendance']] = relationship('StudentAttendance', back_populates='student')