from typing import List, TYPE_CHECKING
from extensions import db
from sqlalchemy import CheckConstraint, String, text
from sqlalchemy.orm import Mapped, mapped_column, relationship

if TYPE_CHECKING:
    from app.models import Class, Issue, MakeupClass

class Room(db.Model):
    __tablename__ = 'room'
    __table_args__ = (
        CheckConstraint("status IN ('Free', 'Occupied', 'Maintenance')", name='CHK_room_status'),
    )

    id: Mapped[str] = mapped_column(String(10), primary_key=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    status: Mapped[str] = mapped_column(String(20), nullable=False, server_default=text("'Free'"))

    issue: Mapped[List['Issue']] = relationship('Issue', back_populates='room')
    class_: Mapped[List['Class']] = relationship('Class', back_populates='room')
    makeup_class: Mapped[List['MakeupClass']] = relationship('MakeupClass', back_populates='room')
