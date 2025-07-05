from backend.src.extensions import db
from datetime import datetime

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.String(10), primary_key=True)
    username = db.column(db.String(20), unique=True, nullable=False)
    password_hash = db.Column(db.Text, nullable=False)
    created_date = db.Column(db.DateTime, default=datetime.now)

    employee_id = db.Column(db.String(10), db.ForeignKey('employees.id'), nullable=True)
    employee = db.relationship("Employee", back_populates="user")

