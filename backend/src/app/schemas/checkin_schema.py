from extensions import ma
from marshmallow import fields

class CheckinSchema(ma.Schema):
    id = fields.String(required=False)
    employee_id = fields.String(required=True)
    checkin_time = fields.DateTime(required=False)
    checkout_time = fields.DateTime(required=False)
    status = fields.String(required=False)
    
checkin_schema = CheckinSchema()