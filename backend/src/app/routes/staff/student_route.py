from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from sqlalchemy.exc import IntegrityError, OperationalError
from extensions import db
from ...auth import role_required
from ...models import Student, Enrolment, Contract, Course
from ...schemas.learning_advisor.student_schema import student_schema, students_schema
from ...schemas.learning_advisor.enrolment_schema import enrolment_schema, enrolments_schema
from ...http_status import HTTPStatus

student_bp = Blueprint("student_bp", __name__, url_prefix="/student")

def get_student_id():
    id = request.args.get("id")
    if not id:
        return None, jsonify({
            "message": "Missing student ID in query params"
        }), HTTPStatus.BAD_REQUEST
    
    return id, None, None

def get_enrolment_id():
    id = request.args.get("id")
    if not id:
        return None, jsonify({
            "message": "Missing enrolment ID in query params"
        }), HTTPStatus.BAD_REQUEST
    
    return id, None, None
    
def validate_student(student_id):
    student = db.session.get(Student, student_id)
    if not student:
        return None, jsonify({
            "message": "Student not found"
        }), HTTPStatus.NOT_FOUND
    
    return student, None, None

def validate_course(course_id, course_date):
    course = db.session.get(Course, (course_id, course_date))
    if not course:
        return None, jsonify({
            "message": "Course not found"
        }), HTTPStatus.NOT_FOUND
        
    return course, None, None

def validate_contract(contract_id):
    contract = db.session.get(Contract, contract_id)
    if not contract:
        return None, jsonify({
            "message": "Contract not found"
        }), HTTPStatus.NOT_FOUND
    
    return contract, None, None

def validate_enrolment(enrolment_id):
    enrolment = db.session.get(Enrolment, enrolment_id)
    if not enrolment:
        return None, jsonify({
            "message": "Enrolment not found"
        }), HTTPStatus.BAD_REQUEST
    
    return enrolment, None, None

@student_bp.post("/add")
@role_required("Learning Advisor")
def add_student(): 
    try:
        if not request.is_json:
            return jsonify({
                "message": "Missing or invalid JSON"
            }), HTTPStatus.BAD_REQUEST
        
        json_data = request.get_json()
        validated = student_schema.load(json_data)
        
        student = Student(
            id=validated["id"],
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

@student_bp.get("/")
@role_required("Learning Advisor")
def get_all():
    try:
        students = db.session.query(Student).all()
        return jsonify(students_schema.dump(students)), HTTPStatus.OK
    
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "message": "Unexpected error occurred",
            "error": str(e)
        }), HTTPStatus.INTERNAL_SERVER_ERROR

@student_bp.get("/search")
@role_required("Learning Advisor")
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

@student_bp.put("/update")
@role_required("Learning Advisor")
def update_student():
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

@student_bp.delete("/delete")
@role_required("Learning Advisor")
def delete_student():
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
    
@student_bp.post("/enrolment/add")
@role_required("Learning Advisor")
def add_enrolment():
    try:
        if not request.is_json:
            return jsonify({
                "message": "Missing or invalid JSON"
            }), HTTPStatus.BAD_REQUEST
            
        json_data = request.get_json()
        validated = enrolment_schema.load(json_data)
        
        contract, response, status = validate_contract(validated["contract_id"])
        if not contract:
            return response, status
        
        student, response, status = validate_student(validated["student_id"])
        if not student:
            return response, status
        
        course, response, status = validate_course(validated["course_id"], validated["course_date"])
        if not course:
            return response, status
        
        enrolment = Enrolment(
            id=validated["id"],
            contract_id=validated["contract_id"],
            student_id=validated["student_id"],
            course_id=validated["course_id"],
            course_date=validated["course_date"],
            enrolment_date=validated["enrolment_date"]
        )
        db.session.add(enrolment)
        db.session.commit()
        
        return jsonify(enrolment_schema.dump(enrolment)), HTTPStatus.CREATED
    
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

@student_bp.get("/enrolment/")
@role_required("Learning Advisor")
def get_all_enrolments():
    try:
        enrolments = db.session.query(Enrolment).all()
        return jsonify(enrolments_schema.dump(enrolments)), HTTPStatus.OK
    
    except Exception as e:
        return jsonify({
            "message": "Unexpected error occurred",
            "error": str(e)
        }), HTTPStatus.INTERNAL_SERVER_ERROR

@student_bp.get("/enrolment/search")
@role_required("Learning Advisor")
def get_enrolment():
    try:
        id, response, status = get_enrolment_id()
        if not id:
            return response, status
        
        enrolment, response, status = validate_enrolment(id)
        if not enrolment:
            return response, status
        
        return jsonify(enrolment_schema.dump(enrolment)), HTTPStatus.OK

    except Exception as e:
        return jsonify({
            "message": "Unexpected error occurred",
            "error": str(e)
        }), HTTPStatus.INTERNAL_SERVER_ERROR

@student_bp.put("/enrolment/update")
@role_required("Learning Advisor")
def update_enrolment():
    try:
        id, response, status = get_enrolment_id()
        if not id:
            return response, status
        
        enrolment, response, status = validate_enrolment(id)
        if not enrolment:
            return response, status
        
        if not request.is_json:
            return jsonify({
                "message": "Missing or invalid JSON"
            }), HTTPStatus.BAD_REQUEST
        
        json_data = request.get_json()
        update_data = enrolment_schema.load(json_data, partial=True)
        
        contract_id = update_data.get("contract_id", enrolment.contract_id)
        student_id = update_data.get("student_id", enrolment.student_id)
        course_id = update_data.get("course_id", enrolment.course_id)
        course_date = update_data.get("course_date", enrolment.course_date)
        
        if contract_id != enrolment.contract_id:
            contract, response, status = validate_contract(contract_id)
            if not contract:
                return response, status
        
        if student_id != enrolment.student_id:
            student, response, status = validate_student(student_id)
            if not student:
                return response, status
                
        if course_id != enrolment.course_id or course_date != enrolment.course_date:
            course, response, status = validate_course(course_id, course_date)
            if not course:
                return response, status
        
        existed_course = db.session.query(Enrolment).filter_by(
            contract_id=contract_id,
            student_id=student_id,
            course_id=course_id,
            course_date=course_date
        ).first()
        if existed_course:
            return jsonify({
                "message": "Enrolment existed"
            }), HTTPStatus.CONFLICT
        
        for key, value in update_data.items():
            setattr(enrolment, key, value)
        
        db.session.commit()
        return jsonify({
            "message": "Enrolment updated successfully"
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
        
@student_bp.delete("/enrolment/delete")
@role_required("Learning Advisor")
def delete_enrolment():
    try:
        id, response, status = get_enrolment_id()
        if not id:
            return response, status
        
        enrolment, response, status = validate_enrolment(id)
        if not enrolment:
            return response, status
        
        db.session.delete(enrolment)
        db.session.commit()
        return jsonify({
            "message": "Enrolment deleted successfully"
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