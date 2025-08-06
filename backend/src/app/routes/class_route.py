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
def generate_id(course_id, course_date, term):
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

def get_class_primary_key(): 
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

def validate_course(course_id, course_date):
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
    
    return room, None, None

def validate_class_date(course_id, course_date, class_date):
    course = db.session.get(Course, (course_id, course_date))
    schedule_list = course.schedule.split(",")
    class_days = [weekday.strip() for weekday in schedule_list[0].strip().split("-")]
    class_hours = [hour.strip() for hour in schedule_list[1].strip().split("-")]
    
    dt = str(class_date).split(" ")
    date = dt[0]
    time = dt[1]
    weekday = datetime.strptime(date, "%Y-%m-%d").strftime("%a")

    if weekday not in class_days:
        return None, jsonify({
            "message": "Weekday not in course's schedule",
            "schedule": f"{course.schedule}"
        }), HTTPStatus.BAD_REQUEST
        
    if time != (class_hours[0] + ":00"):
        return None, jsonify({
            "message": "Start hour not in course's schedule"
        }), HTTPStatus.BAD_REQUEST
        
    return class_date, None, None

def check_existed_class(course, term, class_date):
    existed_class = db.session.query(Class).filter_by(
        course_id=course.id,
        course_date=course.created_date,
        term=term,
        class_date=class_date
    ).first()
    if existed_class:
        return existed_class, jsonify({
            "message": "Class existed"
        }), HTTPStatus.CONFLICT
    
    return None, None, None

def validate_class(primary_key):
    class_ = db.session.get(Class, primary_key)
    if not class_:
        return None, jsonify({
            "message": "Class not found"
        }), HTTPStatus.NOT_FOUND
    
    return class_, None, None

# General Features
@class_bp.get("/search")
@role_required("Learning Advisor", "Manager")
def get_class():
    try:
        id, course_id, course_date, term, response, status = get_class_primary_key()
        if not id or not course_id or not course_date or not term:
            return response, status
        
        class_, response, status = validate_class((id, course_id, course_date, term))
        if not class_:
            return response, status
        
        return jsonify(class_schema.dump(class_)), HTTPStatus.OK

    except Exception as e:
        return jsonify({
            "message": "Unexpected error occurred"
        }), HTTPStatus.INTERNAL_SERVER_ERROR

# Learning Advisor Features
@class_bp.get("/learningadvisor/")
@role_required("Learning Advisor")
def la_get_all_classes_from_course():
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
            
        classes = course.class_
        return jsonify(class_schema.dump(classes, many=True)), HTTPStatus.OK
    
    except Exception as e:
        return jsonify({
            "message": "Unexpected error occurred",
            "error": str(e)
        }), HTTPStatus.INTERNAL_SERVER_ERROR
        
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
        
        course, response, status = validate_course(validated["course_id"], validated["course_date"])
        if not course:
            return response, status 
        
        teacher, response, status = validate_teacher(validated["teacher_id"])
        if not teacher:
            return response, status 
        
        class_date, response, status = validate_class_date(validated["course_id"], validated["course_date"], validated["class_date"])
        if not class_date:
            return response, status
        
        room, response, status = validate_room(validated["room_id"])
        if not room:
            return response, status 

        existed_class, response, status = check_existed_class(course, validated["term"], class_date)
        if existed_class:
            return response, status
        
        class_ = Class(
            id=generate_id(validated["course_id"], validated["course_date"], validated["term"]),
            course_id=course.id,
            course_date=course.created_date,
            term=validated["term"],
            teacher_id=teacher.id,
            room_id=room.id,
            class_date=class_date
        )
        
        setattr(room, "status", "Occupied")
        db.session.add(class_)
        
        enrolments = db.session.query(Enrolment).filter_by(
            course_id=course.id,
            course_date=course.created_date
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
        id, course_id, course_date, term, response, status = get_class_primary_key()
        if not id or not course_id or not course_date or not term:
            return response, status
        
        class_, response, status = validate_class((id, course_id, course_date, term))
        if not class_:
            return response, status
        
        json_data = request.get_json()
        update_data = class_schema.load(json_data, partial=True)
        
        course_id = update_data.get("course_id", class_.course_id)
        course_date = update_data.get("course_date", class_.course_date)
        teacher_id = update_data.get("teacher_id", class_.teacher_id)
        room_id = update_data.get("room_id", class_.room_id)
        class_date = update_data.get("class_date", class_.class_date)

        is_differ_student_attendances = False
        old_class = class_
        
        if course_id != class_.course_id or course_date != class_.course_date:
            result, response, status = validate_course(course_id, course_date)
            if not result:
                return response, status

            is_differ_student_attendances = True
        
        if teacher_id != class_.teacher_id:
            result, response, status = validate_teacher(teacher_id)
            if not result:
                return response, status 
        
        if class_date != class_.class_date:
            result, response, status = validate_class_date(course_id, course_date, class_date)
            if not result:
                return response, status
            
        if room_id != class_.room_id:
            result, response, status = validate_room(room_id)
            if not result:
                return response, status
            
        for key, value in update_data.items():
            setattr(class_, key, value)
            
            if key == "term":
                for student_attendance in old_class.student_attendance:
                    setattr(student_attendance, key, value)
        
        if is_differ_student_attendances:
            db.session.query(StudentAttendance).filter_by(
                class_id=old_class.id,
                course_id=old_class.course_id,
                course_date=old_class.course_date,
                term=old_class.term
            ).delete()
            
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
        id, course_id, course_date, term, response, status = get_class_primary_key()
        if not id or not course_id or not course_date or not term:
            return response, status
        
        class_, response, status = validate_class((id, course_id, course_date, term))
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
        return jsonify(class_schema.dump(classes, many=True)), HTTPStatus.OK
    
    except Exception as e:
        return jsonify({
            "message": "Unexpected error occurred",
            "error": str(e)
        }), HTTPStatus.INTERNAL_SERVER_ERROR
        
# Manager Features
@class_bp.get("/manager/")
@role_required("manager")
def manager_get_all_class_from_course():
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
            
        classes = course.class_
        return jsonify(class_schema.dump(classes, many=True)), HTTPStatus.OK
    
    except Exception as e:
        return jsonify({
            "message": "Unexpected error occurred",
            "error": str(e)
        }), HTTPStatus.INTERNAL_SERVER_ERROR