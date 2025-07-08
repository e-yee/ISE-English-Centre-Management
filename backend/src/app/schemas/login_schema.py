from extensions import ma
from marshmallow import fields

class LoginSchema(ma.Schema):
    username = fields.String(required=True)
    password = fields.String(required=True)

login_schema = LoginSchema()