from typing import TYPE_CHECKING
from extensions import db
from sqlalchemy import Date, ForeignKeyConstraint, Index, String, text
from sqlalchemy.orm import Mapped, mapped_column, relationship
import datetime

if TYPE_CHECKING:
    from app.models import Employee
    
class Account(db.Model):
    __tablename__ = 'account'
    __table_args__ = (
        ForeignKeyConstraint(['employee_id'], ['employee.id'], name='FK_account_employee'),
        Index('FK_account_employee', 'employee_id')
    )

    id: Mapped[str] = mapped_column(String(10), primary_key=True)
    employee_id: Mapped[str] = mapped_column(String(10), nullable=False, unique=True)
    username: Mapped[str] = mapped_column(String(200), nullable=False, unique=True)
    password_hash: Mapped[str] = mapped_column(String(200), nullable=False)
    created_date: Mapped[datetime.date] = mapped_column(Date, nullable=False, server_default=text('curdate()'))

    employee: Mapped['Employee'] = relationship('Employee', back_populates='account', uselist=False)