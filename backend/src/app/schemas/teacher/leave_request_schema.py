from extensions import ma
from marshmallow import fields

class LeaveRequestSchema(ma.Schema):
    id = fields.String(required=False)
    employee_id = fields.String(required=True)
    substitute_id = fields.String(required=True)
    start_date = fields.Date(required=True)
    end_date = fields.Date(required=True)
    reason = fields.String(required=True)
    status = fields.String(required=False)
    created_date = fields.Date(required=False)

leave_request_schema = LeaveRequestSchema()