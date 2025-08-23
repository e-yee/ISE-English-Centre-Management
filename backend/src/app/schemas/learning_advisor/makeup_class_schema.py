from marshmallow import fields
from marshmallow_sqlalchemy.fields import Nested
from extensions import ma
from ..employee_schema import EmployeeSchema

class MakeupClassSchema(ma.Schema):
    id = fields.String(dump_only=True)
    student_id = fields.String(dump_only=True)
    class_id = fields.String(required=True)
    course_id = fields.String(dump_only=True)
    level_choice = fields.String(load_only=True)
    course_date = fields.Date(required=True)
    term = fields.Integer(required=True)
    teacher_id = fields.String(required=True)
    room_id = fields.String(required=True)
    teacher = Nested(EmployeeSchema, only=("full_name",))

makeup_class_schema = MakeupClassSchema()