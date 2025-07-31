from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from sqlalchemy.exc import IntegrityError, OperationalError
from extensions import db
from ...auth import role_required
from ...models import Employee, Class, Room
from ...schemas.learning_advisor.class_schema import class_schema, classes_schema
from ...schemas.learning_advisor.room_schema import room_schema, rooms_schema

class_bp = Blueprint("class_bp", __name__, url_prefix="/class")

@class_bp.post("/add")
@role_required("Learning Advisor")
def add_class():
    pass

@class_bp.get("/")
@role_required("Learning Advisor")
def get_all():
    pass

@class_bp.get("/search")
@role_required("Learning Advisor")
def get_class():
    pass

@class_bp.put("/update")
@role_required("Learning Advisor")
def update_class():
    pass

@class_bp.delete("/delete")
@role_required("Learning Advisor")
def delete_class():
    pass