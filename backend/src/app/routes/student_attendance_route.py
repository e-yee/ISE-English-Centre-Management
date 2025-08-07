from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from sqlalchemy.exc import IntegrityError, OperationalError
from extensions import db
from ..auth import role_required
from ..models import Class, Enrolment, Student, StudentAttendance
from ..schemas.learning_advisor.student_attendance_schema import student_attendance_schema
from ..http_status import HTTPStatus

student_attendance_bp = Blueprint("student_attendance_bp", __name__, url_prefix="/student_attendance")

# Helper Functions
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

def get_student_id():
    student_id = request.args.get("student_id")
    
    if not student_id:
        return None, jsonify({
            "message": "Missing student ID in query params"
        }), HTTPStatus.BAD_REQUEST
    
    return student_id, None, None

def validate_existing_class(primary_key):
    class_ = db.session.get(Class, primary_key)
    if not class_:
        return None, jsonify({
            "message": "Class not found"
        }), HTTPStatus.NOT_FOUND
    
    return class_, None, None

def validate_student(student_id):
    student = db.session.get(Student, student_id)
    
    if not student:
        return None, jsonify({
            "message": "Student not found"
        }), HTTPStatus.NOT_FOUND
    
    return student, None, None

def validate_enrolment(student, class_):
    enrolment = db.session.query(Enrolment).filter_by(
        student_id=student.id,
        course_id=class_.course_id,
        course_date=class_.course_date
    ).first()
    
    if not enrolment:
        return None, jsonify({
            "message": "Enrolment not found"
        }), HTTPStatus.NOT_FOUND
    
    return enrolment, None, None

# Learning Advisor Features
@student_attendance_bp.post("/learningadvisor/add")
@role_required("Learning Advisor")
def advisor_create_student_attendance():
    try:
        class_id, course_id, course_date, term, error_response, status_code = get_class_composite_key()
        if not class_id or not course_id or not course_date or not term:
            return error_response, status_code

        class_, error_response, status_code = validate_existing_class((class_id, course_id, course_date, term))
        if not class_:
            return error_response, status_code
        
        if not request.is_json:
            return jsonify({
                "message": "Missing or invalid JSON"
            }), HTTPStatus.BAD_REQUEST
        
        request_data = request.get_json()
        validated_data = student_attendance_schema.load(request_data)
        
        student, error_response, status_code = validate_student(validated_data["student_id"])
        if not student:
            return error_response, status_code
        
        enrolment, error_response, status_code = validate_enrolment(student, class_)
        if not enrolment:
            return error_response, status_code
        
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
        
        return jsonify(student_attendance_schema.dump(student_attendance)), HTTPStatus.CREATED
    
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

@student_attendance_bp.delete("/learningadvisor/delete")
@role_required("Learning Advisor")
def advisor_delete_student_attendance():
    try:
        student_id, error_response, status_code = get_student_id()
        if not student_id:
            return error_response, status_code
        
        class_id, course_id, course_date, term, error_response, status_code = get_class_composite_key()
        if not class_id or not course_id or not course_date or not term:
            return error_response, status_code
        
        student_attendance = db.session.get(StudentAttendance, 
            (student_id, class_id, course_id, course_date, term)
        )
        if not student_attendance:
            return jsonify({
                "message": "Student Attendance not found"
            }), HTTPStatus.NOT_FOUND
        
        db.session.delete(student_attendance)
        db.session.commit()
        
        return jsonify({
            "message": "Student Attendance deleted successfully"
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