from extensions import ma
from marshmallow import fields

class EvaluationSchema(ma.Schema):
    student_id = fields.String(required=True)
    course_id = fields.String(required=True)
    assessment_type = fields.String(required=True)
    course_date = fields.Date(required=True)
    teacher_id = fields.String(required=True)
    grade = fields.String(required=True)
    comment = fields.String(required=True)
    enrolment_id = fields.String(required=True)
    evaluation_date = fields.Date(required=False)

evaluation_schema = EvaluationSchema()
