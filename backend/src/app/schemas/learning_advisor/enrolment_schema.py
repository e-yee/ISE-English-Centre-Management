from extensions import ma
from marshmallow import fields

class EnrolmentSchema(ma.Schema):
    id = fields.String(required=True)
    contract_id = fields.String(required=True)
    student_id = fields.String(required=True)
    course_id = fields.String(required=True)
    course_date = fields.Date(required=True)
    enrolment_date = fields.Date(required=True)
    
enrolment_schema = EnrolmentSchema()