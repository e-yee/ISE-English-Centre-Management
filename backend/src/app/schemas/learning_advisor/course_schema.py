from extensions import ma
from marshmallow import fields

class CourseSchema(ma.Schema):
    id = fields.String(required=True)
    name = fields.String(required=True)
    duration = fields.Integer(required=True)
    start_date = fields.Date(required=True)
    schedule = fields.String(required=True)
    fee = fields.Integer(required=True)
    prerequisites = fields.String(required=True)
    created_date = fields.Date(required=True)
    description = fields.String(allow_none=True)

course_schema = CourseSchema()