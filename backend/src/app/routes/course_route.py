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
def get_course_id_date():
    course_id = request.args.get("id")
    
    if not course_id:
        return None, jsonify({
            "message": "Missing course ID in query params"
        }), HTTPStatus.BAD_REQUEST
    
    course_date = request.args.get("course_date")
    
    if not course_date:
        return None, jsonify({
            "message": "Missing course date in query params"
        }), HTTPStatus.BAD_REQUEST
    
    if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", course_date):
        return None, jsonify({
            "message": "Invalid date format"
        }), HTTPStatus.BAD_REQUEST
        
    return course_id, datetime.strptime(course_date, "%Y-%m-%d"), None, None

def validate_duration(duration):
    if duration < 0:
        return None, jsonify({
            "message": "Duration must be larger than 0"
        }), HTTPStatus.BAD_REQUEST
    
    return duration, None, None

def validate_start_date(date):
    curdate = datetime.now()
    
    if date < curdate:
        return None, jsonify({
            "message": "Date data must be larger than current date"
        }), HTTPStatus.BAD_REQUEST
        
    return date, None, None

def validate_schedule(schedule):
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

def validate_fee(fee):
    if fee < 0:
        return None, jsonify({
            "message": "Fee must be larger than 0"
        }), HTTPStatus.BAD_REQUEST
    
    return fee, None, None

def validate_created_date(date, start_date):
    if date < start_date:
        return None, jsonify({
            "message": "Date data must be larger than start date"
        }), HTTPStatus.BAD_REQUEST
    
    return date, None, None

# Learning Advisor Features
@course_bp.post("/learningadvisor/add")
@role_required("Learning Advisor")
def la_add_course():
    try:
        if not request.is_json:
            return jsonify({
                "message": "Missing or invalid JSON"
            }), HTTPStatus.BAD_REQUEST
        
        json_data = request.get_json()
        validated = course_schema.load(json_data)
        
        duration, response, status = validate_duration(validated["duration"])
        if not duration:
            return response, status

        start_date, response, status = validate_start_date(validated["start_date"])
        if not start_date:
            return response, status

        schedule, response, status = validate_schedule(validated["schedule"])
        if not schedule:
            return response, status

        fee, response, status = validate_fee(validated["fee"])
        if not fee:
            return response, status
        
        created_date, response, status = validate_created_date(validated["created_date"], start_date)
        if not created_date:
            return response, status
        
        employee_id = get_jwt().get("employee_id")
        course = Course(
            id=validated["id"],
            name=validated["name"],
            duration=duration,
            start_date=start_date,
            schedule=schedule,
            learning_advisor_id=employee_id,
            fee=fee,
            prerequisites=validated["prerequisites"],
            created_date=created_date,
            description=validated["description"]
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
def get_all():
    try:
        employee_id = get_jwt().get("employee_id")
        courses = db.session.query(Course).filter_by(learning_advisor_id=employee_id).all()
        return jsonify(course_schema.dump(courses, many=True)), HTTPStatus.OK

    except Exception as e:
        return jsonify({
            "message": "Unexpected error occurred"
        }), HTTPStatus.INTERNAL_SERVER_ERROR

@course_bp.get("/learningadvisor/search")
@role_required("Learning Advisor")
def get_course():
    try:
        course_id, course_date, response, status = get_course_id_date()
        if not course_id or not course_date:
            return response, status

        employee_id = get_jwt().get("employee_id")
        course = db.session.query(Course).filter_by(
            course_id=course_id, 
            course_date=course_date,
            learning_advisor_id=employee_id
        )
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
def update_course():
    try:
        course_id, course_date, response, status = get_course_id_date()
        if not course_id or not course_date:
            return response, status
        
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
        
        json_data = request.get_json()
        update_data = course_schema.load(json_data, partial=True)
        
        if update_data.get("learning_advisor_id"):
            return jsonify({
                "message": "Permission denied"
            }), HTTPStatus.FORBIDDEN
        
        duration = update_data.get("duration", course.duration)
        start_date = update_data.get("start_date", course.start_date)
        schedule = update_data.get("schedule", course.schedule)
        fee = update_data.get("fee", course.fee)
        
        if duration != course.duration:
            result, response, status = validate_duration(duration)
            if not result:
                return response, status

        if start_date != course.start_date:
            result, response, status = validate_start_date(start_date)
            if not result:
                return response, status
           
        if schedule != course.schedule: 
            result, response, status = validate_schedule(schedule)
            if not result:
                return response, status

        if fee != course.fee:
            result, response, status = validate_fee(fee)
            if not result:
                return response, status
        
        for key, value in update_data.items():
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