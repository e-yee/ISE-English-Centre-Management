from typing import List, Optional, TYPE_CHECKING
from extensions import db
from sqlalchemy import Computed, Date, ForeignKeyConstraint, Index, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
import datetime

if TYPE_CHECKING:
    from app.models import ClassSession, Contract, Employee, Enrolment, Evaluation
    
class Class(db.Model):
    __tablename__ = 'class'
    __table_args__ = (
        ForeignKeyConstraint(['teacher_id'], ['employee.id'], name='FK_class_employee'),
        Index('FK_class_employee', 'teacher_id')
    )

    id: Mapped[str] = mapped_column(String(10), primary_key=True)
    class_name: Mapped[str] = mapped_column(String(200), nullable=False)
    duration: Mapped[int] = mapped_column(Integer, nullable=False)
    start_date: Mapped[datetime.date] = mapped_column(Date, nullable=False)
    schedule: Mapped[str] = mapped_column(String(200), nullable=False)
    teacher_id: Mapped[str] = mapped_column(String(10), nullable=False)
    fee: Mapped[int] = mapped_column(Integer, nullable=False)
    prerequisites: Mapped[str] = mapped_column(String(20), nullable=False)
    created_date: Mapped[datetime.date] = mapped_column(Date, primary_key=True)
    class_description: Mapped[Optional[str]] = mapped_column(String(200))
    end_date: Mapped[Optional[datetime.date]] = mapped_column(
        Date, 
        Computed('start_date + INTERVAL duration MONTH', persisted=True)
    )

    teacher: Mapped['Employee'] = relationship('Employee', back_populates='class_', uselist=False)
    class_session: Mapped[List['ClassSession']] = relationship('ClassSession', back_populates='class_')
    contract: Mapped[List['Contract']] = relationship('Contract', back_populates='class_')
    enrolment: Mapped[List['Enrolment']] = relationship('Enrolment', back_populates='class_')
    evaluation: Mapped[List['Evaluation']] = relationship('Evaluation', back_populates='class_')