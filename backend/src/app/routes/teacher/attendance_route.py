from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity, get_jwt
from app.auth import role_required
from marshmallow import ValidationError
from ...http_status import HTTPStatus
from sqlalchemy.exc import IntegrityError, OperationalError
from ...schemas.attendance_schema import list_attendance_schema
from ...models import StudentAttendance, Account, Course, Class, Student, Employee
from extensions import db

attendance_bp = Blueprint("attendance_bp", __name__, url_prefix="/attendance")

def get_course_date():
    date_str = request.args.get("course_date")
    if not date_str:
        return None, jsonify({
            "message": "Course date is required"
        }), HTTPStatus.BAD_REQUEST
    
    return date_str, None, None

def get_term():
    term = request.args.get("term")
    if not term:
        return None, jsonify({
            "message": "Term is required"
        }), HTTPStatus.BAD_REQUEST
    
    return term, None, None

def get_student_id():
    id = request.args.get("student_id")
    if not id:
        return None, jsonify({
            "message": "Student ID is required"
        }), HTTPStatus.BAD_REQUEST
    
    return id, None, None

def get_class_id():
    id = request.args.get("class_id")
    if not id:
        return None, jsonify({
            "message": "Class ID is required"
        }), HTTPStatus.BAD_REQUEST
    
    return id, None, None

def get_course_id():
    id = request.args.get("course_id")
    if not id:
        return None, jsonify({
            "message": "Course ID is required"
        }), HTTPStatus.BAD_REQUEST
    
    return id, None, None

def validate_attendance(teacher_id, class_id, course_id, course_date, term):
    attendance = db.session.query(StudentAttendance).filter_by(
        teacher_id=teacher_id,
        class_id=class_id,
        course_id=course_id,
        course_date=course_date,
        term=term
    ).first()

    if not attendance:
        return None, jsonify({
            "message": "Attendance record not found"
        }), HTTPStatus.NOT_FOUND
    
    return attendance, None, None

def validate_teacher(teacher_id):
    teacher = db.session.query(Employee).filter_by(id=teacher_id, role="Teacher").first()
    if not teacher:
        return jsonify({
            "message": "Invalid teacher ID"
        }), HTTPStatus.BAD_REQUEST
    
    class_id = db.session.query(Class).filter_by(teacher_id=teacher_id).first()

    if not class_id or class_id.teacher_id != teacher:
        return jsonify({
            "message": "Teacher is not assigned to this class"
        }), HTTPStatus.BAD_REQUEST
    
    return teacher, None, None

def validate_lerning_advisor(learning_advisor_id):
    learning_advisor = db.session.query(Employee).filter_by(id=learning_advisor_id, role="Learning Advisor").first()
    if not learning_advisor:
        return jsonify({
            "message": "Invalid learning advisor ID"
        }), HTTPStatus.BAD_REQUEST
    
    return learning_advisor, None, None

def validate_student(student_id):
    student = db.session.query(Student).filter_by(id=student_id, role="student").first()
    if not student:
        return jsonify({
            "message": "Invalid student ID"
        }), HTTPStatus.BAD_REQUEST
    
    return student, None, None

def validate_class(class_id):
    class_ = db.session.query(Class).filter_by(id=class_id).first()
    if not class_:
        return jsonify({
            "message": "Invalid class ID"
        }), HTTPStatus.BAD_REQUEST
    
    return class_, None, None

def validate_course(course_id, course_date):
    learning_advisor = get_jwt().get("employee_id")
    course = db.session.query(Course).filter_by(
        course_id=course_id,
        learning_advisor=learning_advisor,
        course_date=course_date
    ).first()

    if not course:
        return jsonify({
            "message": "Invalid course ID or date"
        }), HTTPStatus.BAD_REQUEST
    
    return course, None, None

def validate_term(term):
    term = db.session.query(Course).filter_by(term=term).first()
    if not term:
        return jsonify({
            "message": "Invalid term"
        }), HTTPStatus.BAD_REQUEST
    return term, None, None

@attendance_bp.get("/view")
@role_required("Teacher", "Learning Advisor")
def view_attendance():
    try:
        id = get_jwt().get("employee_id")
        teacher, error_response, status_code = validate_teacher(id)

        la, error_response, status_code = validate_lerning_advisor(id)
        if not teacher or not la:
            return error_response, status_code

        class_id, error_response, status_code = get_class_id()
        if not class_id:
            return error_response, status_code
        
        course_id, error_response, status_code = get_course_id()
        if not course_id:
            return error_response, status_code
        
        term, error_response, status_code = get_term()
        if not term:
            return error_response, status_code
        
        course_date, error_response, status_code = get_course_date()
        if not course_date:
            return error_response, status_code
        
        records = db.session.query(StudentAttendance).filter_by(
            class_id=class_id,
            course_id=course_id,
            course_date=course_date,
            term=term
        ).all()

        return jsonify(list_attendance_schema.dump(records, many=True)), HTTPStatus.OK

    except Exception as e:
        return jsonify({"message": "An unexpected error occurred"}), HTTPStatus.INTERNAL_SERVER_ERROR
    
@attendance_bp.patch("/mark")
@role_required("Teacher")
def mark_attendance():
    try:
        if not request.is_json:
            return jsonify({"message": "Request must be JSON"}), HTTPStatus.BAD_REQUEST
        
        teacher_id = get_jwt().get("employee_id")
        teacher, error_response, status_code = validate_teacher(teacher_id)

        if not teacher:
            return error_response, status_code
        
        class_id, error_response, status_code = get_class_id()
        if not class_id:
            return error_response, status_code
        
        course_id, error_response, status_code = get_course_id()
        if not course_id:
            return error_response, status_code
        
        course_date, error_response, status_code = get_course_date()
        if not course_date:
            return error_response, status_code
        
        term, error_response, status_code = get_term()
        if not term:
            return error_response, status_code
        
        data = request.get_json()
        validated = list_attendance_schema.load(data)
        records = validated["marks"]

        updated_records = 0
        for record in records:
            student_id = record["student_id"]
            status = record["status"]

            attendance_record = db.session.query(StudentAttendance).filter_by(
                student_id=student_id,
                class_id=class_id,
                course_id=course_id,
                course_date=course_date,
                term=term
            ).first()

            if attendance_record:
                if attendance_record.status != status:
                    attendance_record.status = status
                    updated_records += 1
        
        if updated_records > 0:
            db.session.commit()
            return jsonify({"message": f"Updated {updated_records} attendance records"}), HTTPStatus.OK
        
        return jsonify({"message": "No records updated"}), HTTPStatus.OK
    
    except ValidationError as ve:
        return jsonify({
            "message": "Invalid input", "errors": ve.messages
        }), HTTPStatus.BAD_REQUEST
    
    except IntegrityError as ie:
        db.session.rollback()
        return jsonify({
            "message": "Database error", "error": str(ie.orig)
        }), HTTPStatus.BAD_REQUEST
    
    except OperationalError as oe:
        db.session.rollback()
        return jsonify({
            "message": "Database connection error", "error": str(oe)
        }), HTTPStatus.BAD_REQUEST
    
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "An unexpected error occurred"}), HTTPStatus.INTERNAL_SERVER_ERROR
        


    

    


