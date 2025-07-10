from typing import TYPE_CHECKING
from extensions import db
from sqlalchemy import CheckConstraint, ForeignKeyConstraint, Index, Date, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
import datetime

if TYPE_CHECKING:
    from app.models import Class, Employee, Enrolment, Student

class Evaluation(db.Model):
    __tablename__ = 'evaluation'
    __table_args__ = (
        CheckConstraint(
            "assessment_type IN (\
                'Quiz 1', 'Quiz 2', 'Quiz 3', 'Quiz 4',\
                'Writing Project 1', 'Writing Project 2',\
                'Reading Assessment 1', 'Reading Assessment 2'\
            )", name='CHK_evaluation_type'
        ),
        ForeignKeyConstraint(
            ['class_id', 'class_date'], 
            ['class.id', 'class.created_date'], name='FK_evaluation_class'
        ),
        ForeignKeyConstraint(['enrolment_id'], ['enrolment.id'], name='enrolment'),
        ForeignKeyConstraint(['student_id'], ['student.id'], name='FK_evaluation_student'),
        ForeignKeyConstraint(['teacher_id'], ['employee.id'], name='FK_evaluation_employee'),
        Index('FK_evaluation_class', 'class_id', 'class_date'),
        Index('FK_evaluation_employee', 'teacher_id'),
        Index('enrolment', 'enrolment_id')
    )

    student_id: Mapped[str] = mapped_column(String(10), primary_key=True)
    class_id: Mapped[str] = mapped_column(String(10), primary_key=True)
    class_date: Mapped[datetime.date] = mapped_column(Date, primary_key=True)
    assessment_type: Mapped[str] = mapped_column(String(200), primary_key=True)
    teacher_id: Mapped[str] = mapped_column(String(10), nullable=False)
    grade: Mapped[str] = mapped_column(String(2), nullable=False)
    comment: Mapped[str] = mapped_column(String(2000), nullable=False)
    enrolment_id: Mapped[str] = mapped_column(String(10), nullable=False)
    evaluation_date: Mapped[datetime.date] = mapped_column(Date, nullable=False)

    class_: Mapped['Class'] = relationship('Class', back_populates='evaluation', uselist=False)
    enrolment: Mapped['Enrolment'] = relationship('Enrolment', back_populates='evaluation', uselist=False)
    student: Mapped['Student'] = relationship('Student', back_populates='evaluation', uselist=False)
    teacher: Mapped['Employee'] = relationship('Employee', back_populates='evaluation', uselist=False)