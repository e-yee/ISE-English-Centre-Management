from marshmallow import fields
from extensions import ma

class ClassSchema(ma.Schema):
    course_id = fields.String(required=True)
    course_date = fields.Date(required=True)
    term = fields.Integer(required=True)
    teacher_id = fields.String(required=True)
    room_id = fields.String(required=True)
    class_date = fields.DateTime(required=True)

class_schema = ClassSchema()