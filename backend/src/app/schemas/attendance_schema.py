from extensions import ma
from marshmallow import fields

class AttendanceSchema(ma.Schema):
    student_id = fields.String(required=True)
    class_id = fields.String(required=True)
    course_id = fields.String(required=True)
    course_date = fields.Date(required=True)  
    term = fields.Integer(required=True)
    enrolment_id = fields.String(required=True)
    status = fields.String(required=True, validate=lambda x: x in ['Present', 'Absent'])

attendance_schema = AttendanceSchema()