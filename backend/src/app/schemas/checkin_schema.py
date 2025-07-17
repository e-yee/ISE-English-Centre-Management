from extensions import ma
from marshmallow import fields

class CheckinSchema(ma.Schema):
    id = fields.String(required=True)
    employee_id = fields.String(required=True)
    checkin_time = fields.DateTime(required=True)
    checkout_time = fields.DateTime(required=True)
    status = fields.String(required=True)
    
checkin_schema = CheckinSchema()