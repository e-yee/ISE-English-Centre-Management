from extensions import ma
from marshmallow import fields

class ContractSchema(ma.Schema):
    id = fields.String(required=True)
    student_id = fields.String(required=True)
    course_id = fields.String(required=True)
    course_date = fields.Date(required=True)
    tuition_fee = fields.Integer(required=True)
    start_date = fields.Date(required=True)
    end_date = fields.Date(required=True)

contract_schema = ContractSchema()