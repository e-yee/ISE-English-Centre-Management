from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from sqlalchemy.exc import IntegrityError, OperationalError
from extensions import db
from ..auth import role_required
from ..models import Student, Class
from ..schemas.learning_advisor.student_schema import student_schema
from ..http_status import HTTPStatus
from ..models import Enrolment


student_bp = Blueprint("student_bp", __name__, url_prefix="/student")

# Helper Functions
def generate_student_id():
    last_student = db.session.query(Student).order_by(Student.id.desc()).first()
    
    if not last_student:
        return "STU001"
    else:
        prefix = last_student.id[:3]
        student_number = int(last_student.id[3:]) + 1
        
        return f"{prefix}{student_number:03}"

def get_student_id():
    id = request.args.get("id")
    if not id:
        return None, jsonify({
            "message": "Missing student ID in query params"
        }), HTTPStatus.BAD_REQUEST
    
    return id, None, None
    
def validate_student(student_id):
    student = db.session.get(Student, student_id)
    if not student:
        return None, jsonify({
            "message": "Student not found"
        }), HTTPStatus.NOT_FOUND
    
    return student, None, None

# General Features
@student_bp.get("/")
@role_required("Learning Advisor", "Manager")
def get_students():
    try:
        student_list = db.session.query(Student).all()
        return jsonify(student_schema.dump(student_list, many=True)), HTTPStatus.OK
    
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "message": "Unexpected error occurred",
            "error": str(e)
        }), HTTPStatus.INTERNAL_SERVER_ERROR

@student_bp.get("/search")
@role_required("Learning Advisor", "Manager")
def get_student():
    try:
        id, error_response, status_code = get_student_id()
        if not id:
            return error_response, status_code
        
        student, error_response, status_code = validate_student(id)
        if not student:
            return error_response, status_code

        return jsonify(student_schema.dump(student)), HTTPStatus.OK

    except Exception as e:
        db.session.rollback()
        return jsonify({
            "message": "Unexpected error occurred"
        }), HTTPStatus.INTERNAL_SERVER_ERROR

# Learning Advisor Features
@student_bp.post("/learningadvisor/add")
@role_required("Learning Advisor")
def advisor_create_student(): 
    try:
        if not request.is_json:
            return jsonify({
                "message": "Missing or invalid JSON"
            }), HTTPStatus.BAD_REQUEST
        
        request_data = request.get_json()
        validated_data = student_schema.load(request_data)
        
        student = Student(
            id=generate_student_id(),
            fullname=validated_data["fullname"],
            contact_info=validated_data["contact_info"],
            date_of_birth=validated_data["date_of_birth"]
        )
        
        db.session.add(student)
        db.session.commit()
        return jsonify(student_schema.dump(student)), HTTPStatus.CREATED
   
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

@student_bp.put("/learningadvisor/update")
@role_required("Learning Advisor")
def advisor_update_student():
    try:
        id, error_response, status_code = get_student_id()
        if not id:
            return error_response, status_code
        
        student, error_response, status_code = validate_student(id)
        if not student:
            return error_response, status_code
        
        if not request.is_json:
            return jsonify({
                "message: Missing or invalid JSON"
            }), HTTPStatus.BAD_REQUEST
        
        request_data = request.get_json()
        update_fields = student_schema.load(request_data, partial=True)
        for key, value in update_fields.items():
            setattr(student, key, value)
        
        db.session.commit()
        return jsonify({
            "message": "Student updated successfully"
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

@student_bp.delete("/learningadvisor/delete")
@role_required("Learning Advisor")
def advisor_delete_student():
    try:
        id, error_response, status_code = get_student_id()
        if not id:
            return error_response, status_code
        
        student, error_response, status_code = validate_student(id)
        if not student:
            return error_response, status_code
        
        db.session.delete(student)
        db.session.commit()
        return jsonify({
            "message": "Student deleted successfully"
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
@student_bp.get("/class/")
@role_required("Teacher", "Learning Advisor", "Manager")
def get_students_by_class():
    try:
        class_id = request.args.get("class_id")
        if not class_id:
            return jsonify({
                "message": "Missing class ID in query params"
            }), HTTPStatus.BAD_REQUEST
            
        course_id = request.args.get("course_id")
        if not course_id:
            return jsonify({
                "message": "Missing course ID in query params"
            }), HTTPStatus.BAD_REQUEST
        
        course_date = request.args.get("course_date")
        if not course_date:
            return jsonify({
                "message": "Missing course date in query params"
            }), HTTPStatus.BAD_REQUEST
            
        term = request.args.get("term")
        if not term:
            return jsonify({
                "message": "Missing class term in query params"
            }), HTTPStatus.BAD_REQUEST
    
        class_ = db.session.get(Class, (class_id, course_id, course_date, term))
        if not class_:
            return jsonify({
                "message": "Class not found"
            }), HTTPStatus.NOT_FOUND
        
        student_list = [student_attendance.student for student_attendance in class_.student_attendance]

        return jsonify(student_schema.dump(student_list, many=True)), HTTPStatus.OK
    
    except Exception as e:
        return jsonify({
            "message": "Unexpected error occurred",
            "error": str(e)
        }), HTTPStatus.INTERNAL_SERVER_ERROR