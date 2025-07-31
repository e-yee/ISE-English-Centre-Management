from marshmallow import fields
from extensions import ma

class ClassSchema(ma.Schema):
    id = fields.String(required=True)
    course_id = fields.String(required=True)
    course_date = fields.Date(required=True)
    term = fields.Integer(required=True)
    teacher_id = fields.String(required=True)
    room_id = fields.String(required=True)

class_schema = ClassSchema()
classes_schema = ClassSchema(many=True)