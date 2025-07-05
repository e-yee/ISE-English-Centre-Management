from backend.src.extensions import db

class Employee(db.Model):
    __tablename__ = "employees"

    employee_id = db.Column(db.String(10), primary_key=True)
    fullname = db.Column(db.String(128))
    email = db.Column(db.String(345), unique=True)
    phone = db.Column(db.String(10), unique=True)
    role = db.Column(db.String(10), default="teacher")
    # Thêm status 

    user = db.relationship("User", back_populates="employee", uselist=False)