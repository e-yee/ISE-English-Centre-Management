from extensions import db
from sqlalchemy import Integer, String, Date, text
from sqlalchemy.orm import Mapped, mapped_column
import datetime

class TokenBlocklist(db.Model):
    __tablename__ = "token_blocklist"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    jti: Mapped[str] = mapped_column(String(36), nullable=False, unique=True)
    created_date: Mapped[datetime.date] = mapped_column(Date, nullable=False, server_default=text('curdate()'))