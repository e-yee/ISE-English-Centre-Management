from extensions import ma
from marshmallow import fields

class StudentSchema(ma.Schema):
    id = fields.String(required=False)  # Optional for input, always included in output
    fullname = fields.String(required=True)
    contact_info = fields.String(required=True)
    date_of_birth = fields.Date(required=True)
    
student_schema = StudentSchema()