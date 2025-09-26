from extensions import ma
from marshmallow import fields

class EmployeeSchema(ma.Schema):
    id = fields.String(dump_only=True)  # Include in responses, not required for input
    full_name = fields.String(required=True)
    email = fields.String(required=True)
    nickname = fields.String(allow_none=True)
    philosophy = fields.String(allow_none=True)
    achievements = fields.String(allow_none=True)
    role = fields.String(required=True)
    phone_number = fields.String(allow_none=True)
    teacher_status = fields.String(allow_none=True)

employee_schema = EmployeeSchema()