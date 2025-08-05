from extensions import ma
from marshmallow import fields

class IssueSchema(ma.Schema):
    id = fields.String(required=False)
    teacher_id = fields.String(required=True)
    issue_type = fields.String(required=True)
    issue_description = fields.String(required=True)
    status = fields.String(required=False)
    reported_date = fields.Date(required=False)
    student_id = fields.String(required=False)
    room_id = fields.String(required=False)

issue_schema = IssueSchema()