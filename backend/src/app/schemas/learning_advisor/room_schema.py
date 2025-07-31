from marshmallow import fields
from extensions import ma

class RoomSchema(ma.Schema):
    id = fields.String(required=True)
    room_name = fields.String(required=True)
    status = fields.String(required=True)

room_schema = RoomSchema()
rooms_schema = RoomSchema(many=True)