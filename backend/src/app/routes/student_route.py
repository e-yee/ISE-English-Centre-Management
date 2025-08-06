from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from sqlalchemy.exc import IntegrityError, OperationalError
from extensions import db
from ..auth import role_required
from ..models import Student, Class
from ..schemas.learning_advisor.student_schema import student_schema
from ..schemas.learning_advisor.enrolment_schema import enrolment_schema
from ..http_status import HTTPStatus

student_bp = Blueprint("student_bp", __name__, url_prefix="/student")

# Helper Functions
def generate_student_id():
    last_student = db.session.query(Student).order_by(Student.id.desc()).first()
    
    if not last_student:
        return "STU001"
    else:
        prefix = last_student.id[:3]
        num = int(last_student.id[3:]) + 1
        
        return f"{prefix}{num:03}"

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
def get_all():
    try:
        students = db.session.query(Student).all()
        return jsonify(student_schema.dump(students, many=True)), HTTPStatus.OK
    
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
        id, response, status = get_student_id()
        if not id:
            return response, status
        
        student, response, status = validate_student(id)
        if not student:
            return response, status

        return jsonify(student_schema.dump(student)), HTTPStatus.OK

    except Exception as e:
        db.session.rollback()
        return jsonify({
            "message": "Unexpected error occurred"
        }), HTTPStatus.INTERNAL_SERVER_ERROR

# Learning Advisor Features
@student_bp.post("/learningadvisor/add")
@role_required("Learning Advisor")
def la_add_student(): 
    try:
        if not request.is_json:
            return jsonify({
                "message": "Missing or invalid JSON"
            }), HTTPStatus.BAD_REQUEST
        
        json_data = request.get_json()
        validated = student_schema.load(json_data)
        
        student = Student(
            id=generate_student_id(),
            fullname=validated["fullname"],
            contact_info=validated["contact_info"],
            date_of_birth=validated["date_of_birth"]
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
def la_update_student():
    try:
        id, response, status = get_student_id()
        if not id:
            return response, status
        
        student, response, status = validate_student(id)
        if not student:
            return response, status
        
        if not request.is_json:
            return jsonify({
                "message: Missing or invalid JSON"
            }), HTTPStatus.BAD_REQUEST
        
        json_data = request.get_json()
        update_data = student_schema.load(json_data, partial=True)
        for key, value in update_data.items():
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
def la_delete_student():
    try:
        id, response, status = get_student_id()
        if not id:
            return response, status
        
        student, response, status = validate_student(id)
        if not student:
            return response, status
        
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

# General Features        
@student_bp.get("/")
@role_required("Teacher", "Learning Advisor", "Manager")
def get_students_in_class():
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
        
        students = [student_attendance.student for student_attendance in class_.student_attendance]
        
        return jsonify(student_schema.dump(students, many=True)), HTTPStatus.OK
    
    except Exception as e:
        return jsonify({
            "message": "Unexpected error occurred",
            "error": str(e)
        }), HTTPStatus.INTERNAL_SERVER_ERROR