from datetime import datetime
from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt
from marshmallow import ValidationError
from sqlalchemy.exc import IntegrityError, OperationalError
from extensions import db
from ...auth import role_required
from ...http_status import HTTPStatus
from ...models import Class, Course, Contract, Employee, Room
from ...schemas.learning_advisor.class_schema import class_schema, classes_schema

class_bp = Blueprint("class_bp", __name__, url_prefix="/class")

def validate_class_date(schedule, class_date):
    schedule_list = schedule.split(",")
    class_days = schedule_list[0].strip().split("-")
    class_hours = schedule_list[1].strip().split("-")
    
    dt = class_date.split(" ")
    date = dt[0]
    time = dt[1]
    weekday = datetime.strptime(date, "%Y-%m-%d").strftime("%A")
    
    if weekday not in class_days:
        return jsonify({
            "message": "Weekday not in course's schedule"
        }), HTTPStatus.BAD_REQUEST, False
        
    if time != class_hours[0]:
        return jsonify({
            "message": "Start hour not in course's schedule"
        }), HTTPStatus.BAD_REQUEST, False
        
    return None, None, True

@class_bp.post("/add")
@role_required("Learning Advisor")
def add_class():
    try:
        if not request.is_json:
            return jsonify({
                "message": "Missing or invalid JSON"
            }), HTTPStatus.BAD_REQUEST
        
        json_data = request.get_json()
        validated = class_schema.load(json_data)
        
        employee_id = get_jwt().get("employee_id")
        contract = db.session.query(Contract).filter_by(
            employee_id=employee_id,
            course_id=validated["course_id"],
            course_date=validated["course_date"]
        )
        if not contract:
            return jsonify({
                "message": "Contract for this course not found"
            }), HTTPStatus.NOT_FOUND
        
        teacher = db.session.get(Employee, validated["teacher_id"])
        if not teacher or teacher.role != "Teacher":
            return jsonify({
                "message": "Employee not found or not Teacher"
            }), HTTPStatus.NOT_FOUND
        elif teacher.teacher_status != "Available":
            return jsonify({
                "message": "Teacher is unavailable"
            }), HTTPStatus.CONFLICT
        
        room = db.session.get(Room, validated["room_id"])
        if not room:
            return jsonify({
                "message": "Room not found"
            }), HTTPStatus.NOT_FOUND
        elif room.status != "Free":
            return jsonify({
                "message": f"Room is in {room.status}"
            }), HTTPStatus.CONFLICT
        else:
            setattr(room, "status", "Occupied")
        
        response, status, result = validate_class_date(validated["class_date"])
        if not result:
            return response, status

        class_ = Class(
            id=validated["id"],
            course_id=validated["course_id"],
            course_date=validated["course_date"],
            term=validated["term"],
            teacher_id=validated["teacher_id"],
            room_id=validated["room_id"],
            class_date=validated["class_date"]
        )
        db.session.add(class_)
        db.session.commit()
        
        return jsonify(class_schema.dump(class_)), HTTPStatus.CREATED
        
    except ValidationError as ve:
        return jsonify({
            "message": "Invalid input",
            "error": ve.messages
        }), HTTPStatus.BAD_REQUEST
    
    except IntegrityError as ie:
        db.session.rollback()
        return jsonify({
            "message": "Violate database constraint",
            "error": str(ie.orig)
        }), HTTPStatus.BAD_REQUEST
    
    except OperationalError as oe:
        db.session.rollback()
        return jsonify({
            "message": "Violate database constraint",
            "error": str(oe.orig)
        }), HTTPStatus.BAD_REQUEST
    
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "message": "Unexpected error occurred",
            "error": str(e)
        }), HTTPStatus.INTERNAL_SERVER_ERROR

@class_bp.get("/")
@role_required("Learning Advisor")
def get_all():
    try:
        classes = db.session.query(Class).all()
        return jsonify(classes_schema.dump(classes)), HTTPStatus.OK
    
    except Exception as e:
        return jsonify({
            "message": "Unexpected error occurred",
            "error": str(e)
        }), HTTPStatus.INTERNAL_SERVER_ERROR

@class_bp.get("/search")
@role_required("Learning Advisor")
def get_class():
    try:
        id = request.args.get("id")
        if not id:
            return jsonify({
                "message": "Missing class ID in query params"
            }), HTTPStatus.BAD_REQUEST
        
        class_ = db.session.get(Class, id)
        if not class_:
            return jsonify({
                "message": "Class not found"
            }), HTTPStatus.NOT_FOUND
        
        return jsonify(class_schema.dump(class_)), HTTPStatus.OK

    except Exception as e:
        return jsonify({
            "message": "Unexpected error occurred"
        }), HTTPStatus.INTERNAL_SERVER_ERROR

@class_bp.put("/update")
@role_required("Learning Advisor")
def update_class():
    pass

@class_bp.delete("/delete")
@role_required("Learning Advisor")
def delete_class():
    pass