from marshmallow import fields
from marshmallow_sqlalchemy.fields import Nested
from extensions import ma
from .course_schema import CourseSchema

class ClassSchema(ma.Schema):
    id = fields.String(required=True)
    course_id = fields.String(required=True)
    course_date = fields.Date(required=True)
    term = fields.Integer(required=True)
    teacher_id = fields.String(required=True)
    room_id = fields.String(required=True)
    class_date = fields.DateTime(required=True)
    course = Nested(CourseSchema)

class_schema = ClassSchema()