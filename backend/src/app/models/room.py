from typing import List, TYPE_CHECKING
from app.models import Base
from sqlalchemy import CheckConstraint, String, text
from sqlalchemy.orm import Mapped, mapped_column, relationship

if TYPE_CHECKING:
    from app.models import Base, ClassSession, Issue, MakeupClass


class Room(Base):
    __tablename__ = 'room'
    __table_args__ = (
        CheckConstraint("status IN ('Free', 'Occupied', 'Maintenance')", name='CHK_room_status'),
    )

    id: Mapped[str] = mapped_column(String(10), primary_key=True)
    room_name: Mapped[str] = mapped_column(String(200))
    status: Mapped[str] = mapped_column(String(20), server_default=text("Free"))

    issue: Mapped[List['Issue']] = relationship('Issue', back_populates='room')
    class_session: Mapped[List['ClassSession']] = relationship('ClassSession', back_populates='room')
    makeup_class: Mapped[List['MakeupClass']] = relationship('MakeupClass', back_populates='room')
