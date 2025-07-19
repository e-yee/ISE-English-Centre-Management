from extensions import ma
from marshmallow import fields

class EvaluationSchema(ma.Schema):
    student_id = fields.String(required=True, validate=ma.validate.Length(equal=10))
    course_id = fields.String(required=True, validate=ma.validate.Length(equal=10))
    assessment_type = fields.String(required=True, validate=ma.validate.OneOf([
        'Quiz 1', 'Quiz 2', 'Quiz 3', 'Quiz 4',
        'Writing Project 1', 'Writing Project 2',
        'Reading Assessment 1', 'Reading Assessment 2'
    ]))
    course_date = fields.Date(required=True)
    teacher_id = fields.String(required=True, validate=ma.validate.Length(equal=10))
    grade = fields.String(required=True, validate=ma.validate.Length(equal=2))
    comment = fields.String(required=True, validate=ma.validate.Length(max=2000))
    enrolment_id = fields.String(required=True, validate=ma.validate.Length(equal=10))
    evaluation_date = fields.Date(required=True)