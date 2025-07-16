from extensions import ma
from marshmallow import fields

class EmployeeSchema(ma.Schema):
    id = fields.String(required=True)
    full_name = fields.String(required=True)
    email = fields.String(required=True)
    role = fields.String(required=True)
    phone_number = fields.String(allow_none=True)
    teacher_status = fields.String(allow_none=True)
    
employee_schema = EmployeeSchema()
employees_schema = EmployeeSchema(many=True)