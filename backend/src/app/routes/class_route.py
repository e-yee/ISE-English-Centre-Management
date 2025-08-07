from datetime import datetime
from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt
from marshmallow import ValidationError
from sqlalchemy.exc import IntegrityError, OperationalError
from extensions import db
from ..auth import role_required
from ..http_status import HTTPStatus
from ..models import Class, Course, Employee, Room, Enrolment, StudentAttendance
from ..schemas.learning_advisor.class_schema import class_schema

class_bp = Blueprint("class_bp", __name__, url_prefix="/class")

# Helper Function
def generate_class_id(course_id, course_date, term):
    last_class = db.session.query(Class).filter_by(
        course_id=course_id,
        course_date=course_date,
        term=term
    ).order_by(Class.id.desc()).first()
    
    if not last_class:
        return "CLS001"
    else:
        prefix = last_class.id[:3]
        num = int(last_class.id[3:]) + 1
        
        return f"{prefix}{num:03}"

def validate_course_for_advisor(course_id, course_date):
    employee_id = get_jwt().get("employee_id")
    course = db.session.query(Course).filter_by(
        id=course_id,
        created_date=course_date,
        learning_advisor_id=employee_id
    ).first()
    
    if not course:
        return None, jsonify({
            "message": "Course not found"
        }), HTTPStatus.NOT_FOUND
    
    return course, None, None

def validate_teacher_availability(teacher_id):
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

def validate_room_availability(room_id):
    room = db.session.get(Room, room_id)
    
    if not room:
        return None, jsonify({
            "message": "Room not found"
        }), HTTPStatus.NOT_FOUND
    elif room.status_code != "Free":
        return None, jsonify({
            "message": f"Room is in {room.status_code}"
        }), HTTPStatus.CONFLICT
    
    return room, None, None

def validate_class_schedule_date(course_id, course_date, class_date):
    course = db.session.get(Course, (course_id, course_date))
    schedule_list = course.schedule.split(",")
    class_days = [weekday.strip() for weekday in schedule_list[0].strip().split("-")]
    class_hours = [hour.strip() for hour in schedule_list[1].strip().split("-")]
    
    datetime_parts = str(class_date).split(" ")
    date_str = datetime_parts[0]
    time_str = datetime_parts[1]
    scheduled_weekday = datetime.strptime(date_str, "%Y-%m-%d").strftime("%a")

    if scheduled_weekday not in class_days:
        return None, jsonify({
            "message": "Weekday not in course's schedule",
            "schedule": f"{course.schedule}"
        }), HTTPStatus.BAD_REQUEST
        
    if time_str != (class_hours[0] + ":00"):
        return None, jsonify({
            "message": "Start hour not in course's schedule"
        }), HTTPStatus.BAD_REQUEST
        
    return class_date, None, None

def get_class_composite_key(): 
    class_id = request.args.get("class_id")
    if not class_id:
        return None, None, None, None, jsonify({
            "message": "Missing class ID in query params"
        }), HTTPStatus.BAD_REQUEST
        
    course_id = request.args.get("course_id")
    if not course_id:
        return None, None, None, None, jsonify({
            "message": "Missing course ID in query params"
        }), HTTPStatus.BAD_REQUEST
    
    course_date = request.args.get("course_date")
    if not course_date:
        return None, None, None, None, jsonify({
            "message": "Missing course date in query params"
        }), HTTPStatus.BAD_REQUEST
        
    term = request.args.get("term")
    if not term:
        return None, None, None, None, jsonify({
            "message": "Missing class term in query params"
        }), HTTPStatus.BAD_REQUEST
        
    return class_id, course_id, course_date, term, None, None

def validate_existing_class(primary_key):
    class_ = db.session.get(Class, primary_key)
    if not class_:
        return None, jsonify({
            "message": "Class not found"
        }), HTTPStatus.NOT_FOUND
    
    return class_, None, None

def check_duplicate_class(course, term, class_date):
    duplicate_class = db.session.query(Class).filter_by(
        course_id=course.id,
        course_date=course.created_date,
        term=term,
        class_date=class_date
    ).first()
    if duplicate_class:
        return duplicate_class, jsonify({
            "message": "Class existed"
        }), HTTPStatus.CONFLICT
    
    return None, None, None

def create_student_attendance(class_):
    enrolments = db.session.query(Enrolment).filter_by(
        course_id=class_.course_id,
        course_date=class_.course_date
    ).all()
        
    for enrolment in enrolments:
        student_attendance = StudentAttendance(
            student_id=enrolment.student_id,
            class_id=class_.id,
            course_id=enrolment.course_id,
            course_date=enrolment.course_date,
            term=class_.term,
            enrolment_id=enrolment.id
        )
        db.session.add(student_attendance)

def delete_student_attendance(class_):
    db.session.query(StudentAttendance).filter_by(
        class_id=class_.id,
        course_id=class_.course_id,
        course_date=class_.course_date,
        term=class_.term
    ).delete()

# General Features
@class_bp.get("/search")
@role_required("Learning Advisor", "Manager")
def get_class_by_id():
    try:
        id, course_id, course_date, term, error_response, status_code = get_class_composite_key()
        if not id or not course_id or not course_date or not term:
            return error_response, status_code
        
        class_, error_response, status_code = validate_existing_class((id, course_id, course_date, term))
        if not class_:
            return error_response, status_code
        
        return jsonify(class_schema.dump(class_)), HTTPStatus.OK

    except Exception as e:
        return jsonify({
            "message": "Unexpected error occurred"
        }), HTTPStatus.INTERNAL_SERVER_ERROR

# Learning Advisor Features
@class_bp.get("/learningadvisor/")
@role_required("Learning Advisor")
def advisor_get_classes_by_course():
    try:
        course_id = request.args.get("course_id")
        course_date = request.args.get("course_date")
        if not course_id or not course_date:
            return jsonify({
                "message": "Missing course ID or course date in query params"
            }), HTTPStatus.BAD_REQUEST
        
        employee_id = get_jwt().get("employee_id")
        course = db.session.query(Course).filter_by(
            id=course_id,
            created_date=course_date,
            learning_advisor_id=employee_id
        ).first()
        if not course:
            return jsonify({
                "message": "Course not found"
            }), HTTPStatus.NOT_FOUND
            
        class_list = course.class_
        return jsonify(class_schema.dump(class_list, many=True)), HTTPStatus.OK
    
    except Exception as e:
        return jsonify({
            "message": "Unexpected error occurred",
            "error": str(e)
        }), HTTPStatus.INTERNAL_SERVER_ERROR

@class_bp.post("/learningadvisor/add")
@role_required("Learning Advisor")
def advisor_create_class():
    try:
        if not request.is_json:
            return jsonify({
                "message": "Missing or invalid JSON"
            }), HTTPStatus.BAD_REQUEST
        
        request_data = request.get_json()
        validated_data = class_schema.load(request_data)
        
        course, error_response, status_code = validate_course_for_advisor(validated_data["course_id"], validated_data["course_date"])
        if not course:
            return error_response, status_code 
        
        teacher, error_response, status_code = validate_teacher_availability(validated_data["teacher_id"])
        if not teacher:
            return error_response, status_code 
        
        class_date, error_response, status_code = validate_class_schedule_date(validated_data["course_id"], validated_data["course_date"], validated_data["class_date"])
        if not class_date:
            return error_response, status_code
        
        room, error_response, status_code = validate_room_availability(validated_data["room_id"])
        if not room:
            return error_response, status_code 

        duplicate_class, error_response, status_code = check_duplicate_class(course, validated_data["term"], class_date)
        if duplicate_class:
            return error_response, status_code
        
        class_ = Class(
            id=generate_class_id(validated_data["course_id"], validated_data["course_date"], validated_data["term"]),
            course_id=course.id,
            course_date=course.created_date,
            term=validated_data["term"],
            teacher_id=teacher.id,
            room_id=room.id,
            class_date=class_date
        )
        
        setattr(room, "status_code", "Occupied")
        db.session.add(class_)
        
        # Add student attendance automatically feature
        create_student_attendance(class_)
            
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
def advisor_update_class():
    try:
        id, course_id, course_date, term, error_response, status_code = get_class_composite_key()
        if not id or not course_id or not course_date or not term:
            return error_response, status_code
        
        class_, error_response, status_code = validate_existing_class((id, course_id, course_date, term))
        if not class_:
            return error_response, status_code
        
        request_data = request.get_json()
        update_fields = class_schema.load(request_data, partial=True)
        
        course_id = update_fields.get("course_id", class_.course_id)
        course_date = update_fields.get("course_date", class_.course_date)
        teacher_id = update_fields.get("teacher_id", class_.teacher_id)
        room_id = update_fields.get("room_id", class_.room_id)
        class_date = update_fields.get("class_date", class_.class_date)

        is_differ_student_attendances = False
        original_class = class_
        
        if course_id != class_.course_id or course_date != class_.course_date:
            result, error_response, status_code = validate_course_for_advisor(course_id, course_date)
            if not result:
                return error_response, status_code

            is_differ_student_attendances = True
        
        if teacher_id != class_.teacher_id:
            result, error_response, status_code = validate_teacher_availability(teacher_id)
            if not result:
                return error_response, status_code 
        
        if class_date != class_.class_date:
            result, error_response, status_code = validate_class_schedule_date(course_id, course_date, class_date)
            if not result:
                return error_response, status_code
            
        if room_id != class_.room_id:
            result, error_response, status_code = validate_room_availability(room_id)
            if not result:
                return error_response, status_code
            
        for key, value in update_fields.items():
            setattr(class_, key, value)
            
            if key == "term":
                for student_attendance in original_class.student_attendance:
                    setattr(student_attendance, key, value)
        
        # Update student attendance automatically feature
        if is_differ_student_attendances:
            delete_student_attendance(original_class)  
            create_student_attendance(class_)
        
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
def advisor_delete_class():
    try:
        id, course_id, course_date, term, error_response, status_code = get_class_composite_key()
        if not id or not course_id or not course_date or not term:
            return error_response, status_code
        
        class_, error_response, status_code = validate_existing_class((id, course_id, course_date, term))
        if not class_:
            return error_response, status_code
            
        result, error_response, status_code = validate_course_for_advisor(class_.course_id, class_.course_date)
        if not result:
            return jsonify({
                "message": "Permission denied"
            }), HTTPStatus.FORBIDDEN
        
        room = db.session.get(Room, class_.room_id)
        setattr(room, "status_code", "Free")
        
        db.session.delete(class_)
        
        # Delete student attendance automatically
        delete_student_attendance(class_)
        
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
def teacher_get_assigned_classes():
    try:
        teacher_id = get_jwt().get("employee_id")
        class_list = db.session.query(Class).filter_by(teacher_id=teacher_id).all()
        return jsonify(class_schema.dump(class_list, many=True)), HTTPStatus.OK
    
    except Exception as e:
        return jsonify({
            "message": "Unexpected error occurred",
            "error": str(e)
        }), HTTPStatus.INTERNAL_SERVER_ERROR
        
# Manager Features
@class_bp.get("/manager/")
@role_required("manager")
def manager_get_classes_by_course():
    try:
        course_id = request.args.get("course_id")
        course_date = request.args.get("course_date")
        if not course_id or not course_date:
            return jsonify({
                "message": "Missing course ID or course date in query params"
            }), HTTPStatus.BAD_REQUEST
        
        course = db.session.query(Course).filter_by(
            id=course_id,
            created_date=course_date,
        ).first()
        if not course:
            return jsonify({
                "message": "Course not found"
            }), HTTPStatus.NOT_FOUND
            
        class_list = course.class_
        return jsonify(class_schema.dump(class_list, many=True)), HTTPStatus.OK
    
    except Exception as e:
        return jsonify({
            "message": "Unexpected error occurred",
            "error": str(e)
        }), HTTPStatus.INTERNAL_SERVER_ERROR