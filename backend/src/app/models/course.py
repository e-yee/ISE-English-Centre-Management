from typing import List, Optional, TYPE_CHECKING
from extensions import db
from sqlalchemy import Computed, Date, ForeignKeyConstraint, Index, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
import datetime

if TYPE_CHECKING:
    from app.models import Class, Contract, Employee, Enrolment, Evaluation
    
class Course(db.Model):
    __tablename__ = 'course'
    __table_args__ = (
        ForeignKeyConstraint(['learning_advisor_id'], ['employee.id'], name='FK_course_employee'),
        Index('FK_course_employee', 'learning_advisor_id')
    )

    id: Mapped[str] = mapped_column(String(10), primary_key=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    duration: Mapped[int] = mapped_column(Integer, nullable=False)
    start_date: Mapped[datetime.date] = mapped_column(Date, nullable=False)
    schedule: Mapped[str] = mapped_column(String(200), nullable=False)
    learning_advisor_id: Mapped[str] = mapped_column(String(10), nullable=False)
    fee: Mapped[int] = mapped_column(Integer, nullable=False)
    prerequisites: Mapped[str] = mapped_column(String(20), nullable=False)
    created_date: Mapped[datetime.date] = mapped_column(Date, primary_key=True)
    description: Mapped[Optional[str]] = mapped_column(String(200))
    end_date: Mapped[Optional[datetime.date]] = mapped_column(
        Date, 
        Computed('start_date + INTERVAL duration MONTH', persisted=True)
    )

    learning_advisor: Mapped['Employee'] = relationship('Employee', back_populates='course', uselist=False)
    class_: Mapped[List['Class']] = relationship('Class', back_populates='course')
    contract: Mapped[List['Contract']] = relationship('Contract', back_populates='course')
    enrolment: Mapped[List['Enrolment']] = relationship('Enrolment', back_populates='course')
    evaluation: Mapped[List['Evaluation']] = relationship('Evaluation', back_populates='course')