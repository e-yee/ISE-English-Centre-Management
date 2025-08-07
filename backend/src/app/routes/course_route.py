from datetime import datetime
import re
from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt
from marshmallow import ValidationError
from sqlalchemy.exc import IntegrityError, OperationalError
from extensions import db
from ..auth import role_required
from ..models import Course
from ..schemas.learning_advisor.course_schema import course_schema
from ..http_status import HTTPStatus

course_bp = Blueprint("course_bp", __name__, url_prefix="/course")

# Helper Functions
def generate_course_id(course_name):
    prefix_map = {
        "CEFR A1": "ENG001",
        "CEFR A2": "ENG002",
        "CEFR B1": "ENG003",
        "CEFR B2": "ENG004",
        "CEFR C1": "ENG005",
        "CEFR C2": "ENG006",
        "IELTS Foundation": "ENG101",
        "IELTS Pre-Intermediate": "ENG102",
        "IELTS Intermediate": "ENG103",
        "IELTS Upper-Intermediate": "ENG104",
        "IELTS Advanced": "ENG105",
        "TOEIC Foundation": "ENG201",
        "TOEIC Pre-Intermediate": "ENG202",
        "TOEIC Intermediate": "ENG203",
        "TOEIC Upper-Intermediate": "ENG204",
        "TOEIC Advanced": "ENG205",
        "6th Grade Math": "MTH001",
        "7th Grade Math": "MTH002",
        "8th Grade Math": "MTH003",
        "9th Grade Math": "MTH004",
        "10th Grade Math": "MTH101",
        "11th Grade Math": "MTH102",
        "12th Grade Math": "MTH103",
    }
    
    return prefix_map[course_name]

def get_course_composite_key():
    course_id = request.args.get("id")
    
    if not course_id:
        return None, None, jsonify({
            "message": "Missing course ID in query params"
        }), HTTPStatus.BAD_REQUEST
    
    course_date = request.args.get("course_date")
    
    if not course_date:
        return None, None, jsonify({
            "message": "Missing course date in query params"
        }), HTTPStatus.BAD_REQUEST
    
    if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", course_date):
        return None, None, jsonify({
            "message": "Invalid date format"
        }), HTTPStatus.BAD_REQUEST
        
    return course_id, datetime.strptime(course_date, "%Y-%m-%d"), None, None

def validate_course_name(name):
    name_map = {
        "CEFR A1", "CEFR A2", "CEFR B1", "CEFR B2", "CEFR C1", "CEFR C2",
        "IELTS Foundation", "IELTS Pre-Intermediate", "IELTS Intermediate", "IELTS Upper-Intermediate", "IELTS Advanced",
        "TOEIC Foundation", "TOEIC Pre-Intermediate", "TOEIC Intermediate", "TOEIC Upper-Intermediate", "TOEIC Advanced",
        "6th Grade Math", "7th Grade Math", "8th Grade Math", "9th Grade Math", "10th Grade Math", "11th Grade Math", "12th Grade Math"
    }
    
    if name not in name_map:
        return None, jsonify({
            "message": "Invalid course name"
        }), HTTPStatus.BAD_REQUEST
    
    return name, None, None

def validate_course_duration(duration):
    if duration < 0:
        return None, jsonify({
            "message": "Duration must be larger than 0"
        }), HTTPStatus.BAD_REQUEST
    
    return duration, None, None

def validate_course_start_date(date, created_date):
    if date < created_date:
        return None, jsonify({
            "message": "Date data must be larger than created date"
        }), HTTPStatus.BAD_REQUEST
        
    return date, None, None

def validate_course_schedule_format(schedule):
    matched = re.search(r"(\w{3}) - (\w{3}), (\d{2}:\d{2}) - (\d{2}:\d{2})", schedule)
    
    if not matched:
        return None, jsonify({
            "message": "Invalid schedule format"
        }), HTTPStatus.BAD_REQUEST
    
    valid_weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    first_day = matched.group(1)
    second_day = matched.group(2)
    
    if first_day not in valid_weekdays or \
       second_day not in valid_weekdays:
        return None, jsonify({
            "message": "Invalid weekdays"
        }), HTTPStatus.BAD_REQUEST
    
    start_hour, start_minute = map(int, matched.group(3).split(":"))
    end_hour, end_minute = map(int, matched.group(4).split(":"))
    
    if 0 > start_hour or start_hour >= 24 or \
       0 > end_hour or end_hour >= 24:
        return None, jsonify({
            "message": "Invalid hour"
        }), HTTPStatus.BAD_REQUEST
    
    if 0 > start_minute or start_minute >= 60 or \
       0 > end_minute or end_minute >= 60:
        return None, jsonify({
            "message": "Invalid minute"
        }), HTTPStatus.BAD_REQUEST
        
    return schedule, None, None

def validate_course_fee(fee):
    if fee < 0:
        return None, jsonify({
            "message": "Fee must be larger than 0"
        }), HTTPStatus.BAD_REQUEST
    
    return fee, None, None

def validate_course_created_date(date):
    milestones = datetime.strptime("2025-01-01", "%Y-%m-%d")
    
    if date < milestones.date():
        return None, jsonify({
            "message": "Date data must be larger than 2025-01-01"
        }), HTTPStatus.BAD_REQUEST
    
    return date, None, None

# Learning Advisor Features
@course_bp.post("/learningadvisor/add")
@role_required("Learning Advisor")
def advisor_create_course():
    try:
        if not request.is_json:
            return jsonify({
                "message": "Missing or invalid JSON"
            }), HTTPStatus.BAD_REQUEST
        
        request_data = request.get_json()
        validated_data = course_schema.load(request_data)
        
        name, error_response, status_code = validate_course_name(validated_data["name"])
        if not name:
            return error_response, status_code
        
        duration, error_response, status_code = validate_course_duration(validated_data["duration"])
        if not duration:
            return error_response, status_code

        schedule, error_response, status_code = validate_course_schedule_format(validated_data["schedule"])
        if not schedule:
            return error_response, status_code

        fee, error_response, status_code = validate_course_fee(validated_data["fee"])
        if not fee:
            return error_response, status_code
        
        created_date, error_response, status_code = validate_course_created_date(validated_data["created_date"])
        if not created_date:
            return error_response, status_code
        
        start_date, error_response, status_code = validate_course_start_date(validated_data["start_date"], created_date)
        if not start_date:
            return error_response, status_code
        
        employee_id = get_jwt().get("employee_id")
        course = Course(
            id=generate_course_id(name),
            name=name,
            duration=duration,
            start_date=start_date,
            schedule=schedule,
            learning_advisor_id=employee_id,
            fee=fee,
            prerequisites=validated_data["prerequisites"],
            created_date=created_date,
            description=validated_data["description"]
        )
        
        db.session.add(course)
        db.session.commit()
        
        return jsonify(course_schema.dump(course)), HTTPStatus.CREATED

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
        
@course_bp.get("/learningadvisor/")
@role_required("Learning Advisor")
def advisor_get_courses():
    try:
        employee_id = get_jwt().get("employee_id")
        course_list = db.session.query(Course).filter_by(learning_advisor_id=employee_id).all()
        return jsonify(course_schema.dump(course_list, many=True)), HTTPStatus.OK

    except Exception as e:
        return jsonify({
            "message": "Unexpected error occurred"
        }), HTTPStatus.INTERNAL_SERVER_ERROR

@course_bp.get("/learningadvisor/search")
@role_required("Learning Advisor")
def advisor_get_course():
    try:
        course_id, course_date, error_response, status_code = get_course_composite_key()
        if not course_id or not course_date:
            return error_response, status_code

        employee_id = get_jwt().get("employee_id")
        course = db.session.query(Course).filter_by(
            course_id=course_id, 
            course_date=course_date,
            learning_advisor_id=employee_id
        ).first()
        if not course:
            return jsonify({
                "message": "Course not found"
            }), HTTPStatus.NOT_FOUND
        
        return jsonify(course_schema.dump(course)), HTTPStatus.OK

    except Exception as e:
        return jsonify({
            "message": "Unexpected error occurred"
        }), HTTPStatus.INTERNAL_SERVER_ERROR
        
@course_bp.put("/learningadvisor/update")
@role_required("Learning Advisor")
def advisor_update_course():
    try:
        course_id, course_date, error_response, status_code = get_course_composite_key()
        if not course_id or not course_date:
            return error_response, status_code
        
        employee_id = get_jwt().get("employee_id")
        course = db.session.query(Course).filter_by(
            course_id=course_id, 
            course_date=course_date,
            learning_advisor_id=employee_id
        ).first()
        if not course:
            return jsonify({
                "message": "Course not found"
            }), HTTPStatus.NOT_FOUND 
        
        if not request.is_json:
            return jsonify({
                "message": "Missing or invalid JSON"
            }), HTTPStatus.BAD_REQUEST
        
        request_data = request.get_json()
        update_fields = course_schema.load(request_data, partial=True)
        
        if update_fields.get("learning_advisor_id"):
            return jsonify({
                "message": "Permission denied"
            }), HTTPStatus.FORBIDDEN
        
        duration = update_fields.get("duration", course.duration)
        start_date = update_fields.get("start_date", course.start_date)
        schedule = update_fields.get("schedule", course.schedule)
        fee = update_fields.get("fee", course.fee)
        
        if duration != course.duration:
            result, error_response, status_code = validate_course_duration(duration)
            if not result:
                return error_response, status_code

        if start_date != course.start_date:
            result, error_response, status_code = validate_course_start_date(start_date)
            if not result:
                return error_response, status_code
           
        if schedule != course.schedule: 
            result, error_response, status_code = validate_course_schedule_format(schedule)
            if not result:
                return error_response, status_code

        if fee != course.fee:
            result, error_response, status_code = validate_course_fee(fee)
            if not result:
                return error_response, status_code
        
        for key, value in update_fields.items():
            setattr(course, key, value)
            
        db.session.commit()
        
        return jsonify({
            "message": "Course updated successfully"
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

@course_bp.delete("/learningadvisor/delete")
@role_required("Learning Advisor")
def advisor_delete_course():
    try:
        course_id, course_date, error_response, status_code = get_course_composite_key()
        if not course_id or not course_date:
            return error_response, status_code
        
        employee_id = get_jwt().get("employee_id")
        course = db.session.query(Course).filter_by(
            course_id=course_id, 
            course_date=course_date,
            learning_advisor_id=employee_id
        ).first()
        if not course:
            return jsonify({
                "message": "Course not found"
            }), HTTPStatus.NOT_FOUND
        
        db.session.delete(course)
        db.session.commit()
        
        return jsonify({
            "message": "Course deleted successfully"
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

# Manager Features
@course_bp.get("/manager/")
@role_required("Manager")
def manager_get_courses():
    try:
        course_list = db.session.query(Course).all()
        return jsonify(course_schema.dump(course_list, many=True)), HTTPStatus.OK

    except Exception as e:
        return jsonify({
            "message": "Unexpected error occurred"
        }), HTTPStatus.INTERNAL_SERVER_ERROR

@course_bp.get("/manager/search")
@role_required("Manager")
def manager_get_course():
    try:
        course_id, course_date, error_response, status_code = get_course_composite_key()
        if not course_id or not course_date:
            return error_response, status_code

        course = db.session.query(Course).filter_by(
            course_id=course_id, 
            course_date=course_date,
        ).first()
        if not course:
            return jsonify({
                "message": "Course not found"
            }), HTTPStatus.NOT_FOUND
        
        return jsonify(course_schema.dump(course)), HTTPStatus.OK

    except Exception as e:
        return jsonify({
            "message": "Unexpected error occurred"
        }), HTTPStatus.INTERNAL_SERVER_ERROR