from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt
from marshmallow import ValidationError
from sqlalchemy.exc import IntegrityError, OperationalError
from extensions import db
from ..auth import role_required
from ..models import Course, Class, MakeupClass, Room, Employee
from ..schemas.learning_advisor.makeup_class_schema import makeup_class_schema
from ..http_status import HTTPStatus

makeup_class_bp = Blueprint("makeup_class_bp", __name__, url_prefix="/makeup_class")

# Helper Functions
def validate_level_choice(choice):
    choice_map = {
        "CEFR A1",
        "CEFR A2",
        "CEFR B1",
        "CEFR B2",
        "CEFR C1",
        "CEFR C2",
        "IELTS Foundation",
        "IELTS Pre-Intermediate",
        "IELTS Intermediate",
        "IELTS Upper-Intermediate",
        "IELTS Advanced",
        "TOEIC Foundation",
        "TOEIC Pre-Intermediate",
        "TOEIC Intermediate",
        "TOEIC Upper-Intermediate",
        "TOEIC Advanced",
        "6th Grade Math",
        "7th Grade Math",
        "8th Grade Math",
        "9th Grade Math",
        "10th Grade Math",
        "11th Grade Math",
        "12th Grade Math"
    }
    
    if choice not in choice_map:
        return None, jsonify({
            "message": f"{choice} not in course name"
        }), HTTPStatus.BAD_REQUEST
    
    return choice, None, None
    
def generate_makeup_id(level_choice):
    prefix_map = {
        "CEFR A1": "MAKENG001",
        "CEFR A2": "MAKENG002",
        "CEFR B1": "MAKENG003",
        "CEFR B2": "MAKENG004",
        "CEFR C1": "MAKENG005",
        "CEFR C2": "MAKENG006",
        "IELTS Foundation": "MAKENG101",
        "IELTS Pre-Intermediate": "MAKENG102",
        "IELTS Intermediate": "MAKENG103",
        "IELTS Upper-Intermediate": "MAKENG104",
        "IELTS Advanced": "MAKENG105",
        "TOEIC Foundation": "MAKENG201",
        "TOEIC Pre-Intermediate": "MAKENG202",
        "TOEIC Intermediate": "MAKENG203",
        "TOEIC Upper-Intermediate": "MAKENG204",
        "TOEIC Advanced": "MAKENG205",
        "6th Grade Math": "MAKMTH001",
        "7th Grade Math": "MAKMTH002",
        "8th Grade Math": "MAKMTH003",
        "9th Grade Math": "MAKMTH004",
        "10th Grade Math": "MAKMTH101",
        "11th Grade Math": "MAKMTH102",
        "12th Grade Math": "MAKMTH103",
    }
    
    return prefix_map[level_choice]

def validate_course_for_advisor(course_name, course_date):
    employee_id = get_jwt().get("employee_id")
    course = db.session.query(Course).filter_by(
        name=course_name,
        created_date=course_date,
        learning_advisor_id=employee_id
    ).first()
    
    if not course:
        return None, jsonify({
            "message": "Course for this advisor not found"
        }), HTTPStatus.NOT_FOUND
    
    return course, None, None

def validate_class(class_id, course_id, course_date, term):
    class_ = db.session.get(Class, (class_id, course_id, course_date, term))
    
    if not class_:
        return None, jsonify({
            "message": "Class not found"
        }), HTTPStatus.NOT_FOUND
    
    return class_, None, None

def validate_teacher(teacher_id):
    teacher = db.session.query(Employee).filter_by(
        id=teacher_id,
        role="Teacher"
    ).first()
    
    if not teacher:
        return None, jsonify({
            "message": "Teacher not found"
        }), HTTPStatus.NOT_FOUND
    elif teacher.teacher_status != "Available":
        return None, jsonify({
            "message": "Teacher is Unvailable"
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

def get_makeup_class_composite_key():
    makeup_class_id = request.args.get("id")
    if not makeup_class_id:
        return None, jsonify({
            "message": "Missing makeup class ID in query param"
        }), HTTPStatus.BAD_REQUEST
        
    student_id = request.args.get("student_id")
    if not student_id:
        return None, jsonify({
            "message": "Missing student ID in query param"
        }), HTTPStatus.BAD_REQUEST
        
    class_id = request.args.get("class_id")
    if not class_id:
        return None, jsonify({
            "message": "Missing class ID in query param"
        }), HTTPStatus.BAD_REQUEST
    
    course_id = request.args.get("course_id")
    if not course_id:
        return None, jsonify({
            "message": "Missing course ID in query param"
        }), HTTPStatus.BAD_REQUEST
    
    course_date = request.args.get("course_date")
    if not course_date:
        return None, jsonify({
            "message": "Missing course date in query param"
        }), HTTPStatus.BAD_REQUEST
    
    term = request.args.get("term")
    if not term:
        return None, jsonify({
            "message": "Missing term in query param"
        }), HTTPStatus.BAD_REQUEST

    return (makeup_class_id, student_id, class_id, course_id, course_date, term), None, None

# Learning Advisor Features
@makeup_class_bp.post("/learningadvisor/add")
@role_required("Learning Advisor")
def advisor_create_makeup_class():
    try:
        if not request.is_json:
            return jsonify({
                "message": "Missing or invalid JSON"
            }), HTTPStatus.BAD_REQUEST
        
        request_data = request.get_json()
        validated_data = makeup_class_schema.load(request_data)
        
        level_choice, error_response, status_code = validate_level_choice(validated_data["level_choice"])
        if not level_choice:
            return error_response, status_code

        course, error_response, status_code = validate_course_for_advisor(level_choice, validated_data["course_date"])
        if not course:
            return error_response, status_code
        
        class_, error_response, status_code = validate_class(
            validated_data["class_id"],
            course.id,
            course.created_date,
            validated_data["term"]
        )
        if not class_:
            return error_response, status_code
        
        teacher, error_response, status_code = validate_teacher(validated_data["teacher_id"])
        if not teacher:
            return error_response, status_code

        room, error_response, status_code = validate_room(validated_data["room_id"])
        if not room:
            return error_response, status_code
        
        absent_student_list = [
            student_attendance for student_attendance in class_.student_attendance
                if student_attendance.status == "Absent"
        ]
        
        for absent_student in absent_student_list:
            makeup_class = MakeupClass(
                id=generate_makeup_id(level_choice),
                student_id=absent_student.student_id,
                class_id=absent_student.class_id,
                course_id=absent_student.course_id,
                course_date=absent_student.course_date,
                term=absent_student.term,
                teacher_id=teacher.id,
                room_id=room.id
            )
            
            db.session.add(makeup_class)
        
        setattr(room, "status", "Occupied")
        
        db.session.commit()
        
        return jsonify({
            "message": "Makeup Classes created successfully"
        }), HTTPStatus.CREATED
    
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
        
@makeup_class_bp.get("/learningadvisor/")
@role_required("Learning Advisor")
def advisor_get_makeup_classes():
    try:
        employee_id = get_jwt().get("employee_id")
        course_list = db.session.query(Course).filter_by(learning_advisor_id=employee_id)
        makeup_class_list = []
        
        for course in course_list:
            makeup_class = db.session.query(MakeupClass).filter_by(
                course_id=course.id,
                course_date=course.created_date
            ).all()
            makeup_class_list.extend(makeup_class)
        
        return jsonify(makeup_class_schema.dump(makeup_class_list, many=True)), HTTPStatus.OK
    
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "message": "Unexpected error occurred",
            "error": str(e)
        }), HTTPStatus.INTERNAL_SERVER_ERROR

@makeup_class_bp.delete("/learningadvisor/delete")
@role_required("Learning Advisor")
def advisor_delete_makeup_class():
    try:
        makeup_class_key, error_response, status_code = get_makeup_class_composite_key()
        if not makeup_class_key:
            return error_response, status_code
        
        makeup_class = db.session.get(MakeupClass, makeup_class_key)
        if not makeup_class:
            return jsonify({
                "message": "Makeup Class not found"
            }), HTTPStatus.NOT_FOUND
        
        db.session.delete(makeup_class)
        db.session.commit()
        
        return jsonify({
            "message": "Makeup Class deleted successfully"
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