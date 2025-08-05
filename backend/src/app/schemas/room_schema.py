from marshmallow import fields
from extensions import ma

class RoomSchema(ma.Schema):
    name = fields.String(required=True)
    status = fields.String(load_default="Free", validate=lambda x: x in ["Free", "Occupied", "Maintenance"])

room_schema = RoomSchema()