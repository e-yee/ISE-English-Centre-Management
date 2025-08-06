from marshmallow import fields
from marshmallow_sqlalchemy.fields import Nested
from extensions import ma
from .course_schema import CourseSchema
from ..employee_schema import EmployeeSchema

class ClassSchema(ma.Schema):
    id = fields.String(dump_only=True)
    course_id = fields.String(required=True)
    course_date = fields.Date(required=True)
    term = fields.Integer(required=True)
    teacher_id = fields.String(required=True)
    room_id = fields.String(required=True)
    class_date = fields.DateTime(required=True)
    course = Nested(CourseSchema, only=("name",))
    teacher = Nested(EmployeeSchema, only=("full_name",))

class_schema = ClassSchema()