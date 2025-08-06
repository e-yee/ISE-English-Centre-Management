from extensions import ma
from marshmallow import fields, validate

class AttendanceSchema(ma.Schema):
    student_id = fields.String(required=True)
    status = fields.String(required=True)

class ListAttendanceSchema(ma.Schema):
    class_id = fields.String(required=True)
    course_id = fields.String(required=True)
    course_date = fields.Date(required=True)
    term = fields.Integer(required=True)
    enrolment_id = fields.String(required=True)
    marks = fields.List(fields.Nested(AttendanceSchema), required=True, validate=validate.Length(min=1))


list_attendance_schema = ListAttendanceSchema()