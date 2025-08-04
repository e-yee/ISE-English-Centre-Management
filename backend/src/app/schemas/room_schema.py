from marshmallow import fields
from extensions import ma

class RoomSchema(ma.Schema):
    room_name = fields.String(required=True)
    status = fields.String(required=True)

room_schema = RoomSchema()