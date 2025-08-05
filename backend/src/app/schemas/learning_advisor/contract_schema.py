from extensions import ma
from marshmallow import fields
from marshmallow_sqlalchemy.fields import Nested
from .student_schema import StudentSchema

class ContractSchema(ma.Schema):
    student_id = fields.String(required=True)
    course_id = fields.String(required=True)
    course_date = fields.Date(required=True)
    tuition_fee = fields.Integer(dump_only=True)
    payment_status = fields.String(dump_only=True)
    student = Nested(StudentSchema, only=("fullname",))

contract_schema = ContractSchema()