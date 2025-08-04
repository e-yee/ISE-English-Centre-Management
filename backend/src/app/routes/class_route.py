from datetime import datetime
from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt
from marshmallow import ValidationError
from sqlalchemy.exc import IntegrityError, OperationalError
from extensions import db
from ..auth import role_required
from ..http_status import HTTPStatus
from ..models import Class, Course, Contract, Employee, Room
from ..schemas.learning_advisor.class_schema import class_schema

class_bp = Blueprint("class_bp", __name__, url_prefix="/class")

# Helper Function
def get_class_id():
    id = request.args.get("id")
    
    if not id:
        return None, jsonify({
            "message": "Missing class ID in query params"
        }), HTTPStatus.BAD_REQUEST
    
    return id, None, None

def validate_course(course_id, course_date):
    employee_id = get_jwt().get("employee_id")
    course = db.session.query(Course).filter_by(
        learning_advisor_id=employee_id,
        course_id=course_id,
        course_date=course_date
    )
    
    if not course:
        return None, jsonify({
            "message": "Course not found"
        }), HTTPStatus.NOT_FOUND
    
    return course, None, None

def validate_teacher(teacher_id):
    teacher = db.session.get(Employee, teacher_id)
    
    if not teacher or teacher.role != "Teacher":
        return None, jsonify({
            "message": "Employee not found or not Teacher"
        }), HTTPStatus.NOT_FOUND
    elif teacher.teacher_status != "Available":
        return None, jsonify({
            "message": "Teacher is unavailable"
        }), HTTPStatus.CONFLICT
    
    return teacher, None, None

def validate_room(room_id):
    room = db.session.get(Room, room_id)
    
    if not room:
        return None, jsonify({
            "message": "Room not found"
        }), HTTPStatus.NOT_FOUND
    elif room.status != "Free":
        return None, jsonify({
            "message": f"Room is in {room.status}"
        }), HTTPStatus.CONFLICT

    setattr(room, "status", "Occupied")
    db.session.commit()
    
    return room, None, None

def validate_class_date(course_id, course_date, class_date):
    course = db.session.get(Course, (course_id, course_date))
    schedule_list = course.schedule.split(",")
    class_days = schedule_list[0].strip().split("-")
    class_hours = schedule_list[1].strip().split("-")
    
    dt = class_date.split(" ")
    date = dt[0]
    time = dt[1]
    weekday = datetime.strptime(date, "%Y-%m-%d").strftime("%a")
    
    if weekday not in class_days:
        return None, jsonify({
            "message": "Weekday not in course's schedule"
        }), HTTPStatus.BAD_REQUEST
        
    if time != (class_hours[0] + ":00"):
        return None, jsonify({
            "message": "Start hour not in course's schedule"
        }), HTTPStatus.BAD_REQUEST
        
    return True, None, None

def validate_class(class_id):
    class_ = db.session.get(Class, class_id)
    if not class_:
        return None, jsonify({
            "message": "Class not found"
        }), HTTPStatus.NOT_FOUND
    
    return class_, None, None

# General Features
@class_bp.get("/")
@role_required("Learning Advisor", "Manager")
def get_all():
    try:
        classes = db.session.query(Class).all()
        return jsonify(class_schema.dump(classes)), HTTPStatus.OK
    
    except Exception as e:
        return jsonify({
            "message": "Unexpected error occurred",
            "error": str(e)
        }), HTTPStatus.INTERNAL_SERVER_ERROR

@class_bp.get("/search")
@role_required("Learning Advisor", "Manager")
def get_class():
    try:
        id, response, status = get_class_id()
        if not id:
            return response, status
        
        class_, response, status = validate_class(id)
        if not class_:
            return response, status
        
        return jsonify(class_schema.dump(class_)), HTTPStatus.OK

    except Exception as e:
        return jsonify({
            "message": "Unexpected error occurred"
        }), HTTPStatus.INTERNAL_SERVER_ERROR

# Learning Advisor Features
@class_bp.post("/learningadvisor/add")
@role_required("Learning Advisor")
def la_add_class():
    try:
        if not request.is_json:
            return jsonify({
                "message": "Missing or invalid JSON"
            }), HTTPStatus.BAD_REQUEST
        
        json_data = request.get_json()
        validated = class_schema.load(json_data)
        
        result, response, status = validate_course(validated["course_id"], validated["course_date"])
        if not result:
            return response, status 
        
        result, response, status = validate_teacher(validated["teacher_id"])
        if not result:
            return response, status 
        
        response, status, result = validate_class_date(validated["course_id"], validated["course_date"], validated["class_date"])
        if not result:
            return response, status
        
        result, response, status = validate_room(validated["room_id"])
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

@class_bp.put("/learningadvisor/update")
@role_required("Learning Advisor")
def la_update_class():
    try:
        id, response, status = get_class_id()
        if not id:
            return response, status
        
        class_, response, status = validate_class(id)
        if not class_:
            return response, status
        
        json_data = request.get_json()
        update_data = class_schema.load(json_data, partial=True)
        
        course_id = update_data.get("course_id", class_.course_id)
        course_date = update_data.get("course_date", class_.course_date)
        teacher_id = update_data.get("teacher_id", class_.teacher_id)
        room_id = update_data.get("room_id", class_.room_id)
        class_date = update_data.get("class_date",class_.class_date)
        
        if course_id != class_.course_id or course_date != class_.course_date:
            result, response, status = validate_course(course_id, course_date)
            if not result:
                return response, status
        
        if teacher_id != class_.teacher_id:
            result, response, status = validate_teacher(teacher_id)
            if not result:
                return response, status 
        
        if class_date != class_.class_date:
            response, status, result = validate_class_date(course_id, course_date, class_date)
            if not result:
                return response, status
            
        if room_id != class_.room_id:
            result, response, status = validate_room(room_id)
            if not result:
                return response, status
        
        for key, value in update_data.items():
            setattr(class_, key, value)
        
        db.session.commit()
        return jsonify({
            "message": "Class updated successfully"
        }), HTTPStatus.OK
    
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

@class_bp.delete("/learningadvisor/delete")
@role_required("Learning Advisor")
def la_delete_class():
    try:
        id, response, status = get_class_id()
        if not id:
            return response, status
        
        class_, response, status = validate_class(id)
        if not class_:
            return response, status
            
        result, response, status = validate_course(class_.course_id, class_.course_date)
        if not result:
            return jsonify({
                "message": "Permission denied"
            }), HTTPStatus.FORBIDDEN
        
        room = db.session.get(Room, class_.room_id)
        setattr(room, "status", "Free")
        
        db.session.delete(class_)
        db.session.commit()
    
        return jsonify({
            "message": "Class deleted successfully"
        }), HTTPStatus.OK
    
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

# Teacher Features
@class_bp.get("/teacher/")
@role_required("Teacher")
def teacher_get_class():
    try:
        teacher_id = get_jwt().get("employee_id")
        classes = db.session.query(Class).filter_by(teacher_id=teacher_id).all()
        return jsonify(class_schema.dump(classes)), HTTPStatus.OK
    
    except Exception as e:
        return jsonify({
            "message": "Unexpected error occurred",
            "error": str(e)
        }), HTTPStatus.INTERNAL_SERVER_ERROR