from app.models import Account
from extensions import ma
from marshmallow import fields

class AccountSchema(ma.Schema):
    id = fields.String(required=True)
    employee_id = fields.String(required=True)
    username = fields.String(required=True)
    password = fields.String(required=True)
    
account_schema = AccountSchema()
accounts_schema = AccountSchema(many=True)