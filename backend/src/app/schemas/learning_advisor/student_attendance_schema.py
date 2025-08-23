from marshmallow import fields
from extensions import ma

class StudentAttendanceSchema(ma.Schema):
    student_id = fields.String(required=True)
    class_id = fields.String(dump_only=True)
    course_id = fields.String(dump_only=True)
    course_date = fields.Date(dump_only=True)
    term = fields.Integer(dump_only=True)
    enrolment_id = fields.String(dump_only=True)

student_attendance_schema = StudentAttendanceSchema()