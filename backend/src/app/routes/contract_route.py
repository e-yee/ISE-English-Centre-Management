from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt
from marshmallow import ValidationError
from sqlalchemy.exc import IntegrityError, OperationalError
from extensions import db
from ..auth import role_required
from ..models import Contract, Student, Course, Enrolment
from ..http_status import HTTPStatus
from ..schemas.learning_advisor.contract_schema import contract_schema

contract_bp = Blueprint("contract_bp", __name__, url_prefix="/contract")

# Helper Function
def generate_contract_id():
    last_contract = db.session.query(Contract).order_by(Contract.id.desc()).first()
    
    if not last_contract:
        return "CON001"
    else:
        prefix = last_contract.id[:3]
        contract_number = int(last_contract.id[3:]) + 1
        
        return f"{prefix}{contract_number:03}"

def generate_enrolment_id():
    last_enrolment = db.session.query(Enrolment).order_by(Enrolment.id.desc()).first()
    
    if not last_enrolment:
        return "ENR001"
    else:
        prefix = last_enrolment.id[:3]
        enrolment_number = int(last_enrolment.id[3:]) + 1
        
        return f"{prefix}{enrolment_number:03}"
    
def get_contract_id():
    id = request.args.get("id")
    if not id:
        return None, jsonify({
            "message": "Missing contract ID in query params"
        }), HTTPStatus.BAD_REQUEST
    
    return id, None, None

def validate_student(student_id):
    student = db.session.get(Student, student_id)
    if not student:
        return None, jsonify({
            "message": "Student not found"
        }), HTTPStatus.NOT_FOUND
    
    return student, None, None

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

def validate_contract_for_advisor(contract_id):
    employee_id = get_jwt().get("employee_id")
    contract = db.session.query(Contract).filter_by(
        id=contract_id,
        employee_id=employee_id
    ).first()
    if not contract:
        return None, jsonify({
            "message": "Contract not found"
        }), HTTPStatus.NOT_FOUND
    
    return contract, None, None

def check_duplicate_contract(student_id, course_id, course_date):
    existed_contract = db.session.query(Contract).filter_by(
        student_id=student_id,
        course_id=course_id,
        course_date=course_date
    ).first()
    if existed_contract:
        return False, jsonify({
            "message": "Contract existed"
        }), HTTPStatus.CONFLICT
    
    return True, None, None

# Learning Advisor Features
@contract_bp.post("/learningadvisor/add")
@role_required("Learning Advisor")
def advisor_create_contract():
    try:        
        if not request.is_json:
            return jsonify({
                "message": "Missing or invalid JSON"
            }), HTTPStatus.BAD_REQUEST
        
        request_data = request.get_json()
        validated_data = contract_schema.load(request_data)
        
        student, error_response, status_code = validate_student(validated_data["student_id"])
        if not student:
            return error_response, status_code

        course, error_response, status_code = validate_course_for_advisor(validated_data["course_id"], validated_data["course_date"])
        if not course:
            return error_response, status_code
        
        result, error_response, status_code = check_duplicate_contract(validated_data["student_id"], validated_data["course_id"], validated_data["course_date"])
        if not result:
            return error_response, status_code
        
        employee_id = get_jwt().get("employee_id")
        contract = Contract(
            id=generate_contract_id(),
            student_id=student.id,
            employee_id=employee_id,
            course_id=course.id,
            course_date=course.created_date,
            tuition_fee=course.fee,
            start_date=course.start_date,
            end_date=course.end_date
        )
        db.session.add(contract)
        
        # Add enrolment automatically
        enrolment = Enrolment(
            id=generate_enrolment_id(),
            contract_id=contract.id,
            student_id=contract.student_id,
            course_id=contract.course_id,
            course_date=contract.course_date,
            enrolment_date=contract.start_date
        )
        db.session.add(enrolment)
        
        db.session.commit()
        return jsonify(contract_schema.dump(contract)), HTTPStatus.CREATED
    
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

@contract_bp.get("/learningadvisor/")
@role_required("Learning Advisor")
def advisor_get_contracts_by_course():
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
            
        contract_list = course.contract
        return jsonify(contract_schema.dump(contract_list, many=True)), HTTPStatus.OK

    except Exception as e:
        db.session.rollback()
        return jsonify({
            "message": "Unexpected error occurred",
            "error": str(e)
        }), HTTPStatus.INTERNAL_SERVER_ERROR
    
@contract_bp.get("/learningadvisor/search")
@role_required("Learning Advisor")
def advisor_get_contract():
    try:
        id, error_response, status_code = get_contract_id()
        if not id:
            return error_response, status_code
        
        contract, error_response, status_code = validate_contract_for_advisor(id)
        if not contract:
            return error_response, status_code
        
        return jsonify(contract_schema.dump(contract)), HTTPStatus.OK

    except Exception as e:
        db.session.rollback()
        return jsonify({
            "message": "Unexpected error occurred",
            "error": str(e)
        }), HTTPStatus.INTERNAL_SERVER_ERROR
    
@contract_bp.put("/learningadvisor/update")
@role_required("Learning Advisor")
def advisor_update_contract():
    try:
        id, error_response, status_code = get_contract_id()
        if not id:
            return error_response, status_code
        
        contract, error_response, status_code = validate_contract_for_advisor(id)
        if not contract:
            return error_response, status_code
        
        if not request.is_json:
            return jsonify({
                "message": "Missing or invalid JSON"
            }), HTTPStatus.BAD_REQUEST
        
        request_data = request.get_json()
        update_fields = contract_schema.load(request_data, partial=True)
        
        student_id = update_fields.get("student_id", contract.student_id)
        course_id = update_fields.get("course_id", contract.course_id)
        course_date = update_fields.get("course_date", contract.course_date)
        
        enrolment = db.session.query(Enrolment).filter_by(contract_id=contract.id).first()
        
        if student_id != contract.student_id:
            student, error_response, status_code = validate_student(student_id)
            if not student:
                return error_response, status_code
            
            setattr(enrolment, "student_id", student_id)
                    
        if course_id != contract.course_id or course_date != contract.course_date:
            course, error_response, status_code = validate_course_for_advisor(course_id, course_date)
            if not course:
                return error_response, status_code
            
            setattr(contract, "start_date", course.start_date)
            setattr(contract, "end_date", course.end_date)
            setattr(contract, "tuition_fee", course.fee)
            
            setattr(enrolment, "course_id", course_id)
            setattr(enrolment, "course_date", course_date)
            setattr(enrolment, "enrolment_date", course.start_date)

        result, error_response, status_code = check_duplicate_contract(student_id, course_id, course_date)
        if not result:
            return error_response, status_code
        
        for key, value in update_fields.items():
            setattr(contract, key, value)
        
        db.session.commit()
        return jsonify({
            "message": "Contract updated successfully"
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

@contract_bp.delete("/learningadvisor/delete")
@role_required("Learning Advisor")
def advisor_delete_contract():
    try:
        id, error_response, status_code = get_contract_id()
        if not id:
            return error_response, status_code
        
        contract, error_response, status_code = validate_contract_for_advisor(id)
        if not contract:
            return error_response, status_code
        
        db.session.delete(contract)
        db.session.query(Enrolment).filter_by(contract_id=contract.id).delete()
        
        db.session.commit()
        return jsonify({
            "message": "Contract deleted successfully"
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
@contract_bp.get("/manager/")
@role_required("Manager")
def manager_get_contracts_by_course():
    try:
        course_id = request.args.get("course_id")
        course_date = request.args.get("course_date")
        if not course_id or not course_date:
            return jsonify({
                "message": "Missing course ID or course date in query params"
            }), HTTPStatus.BAD_REQUEST
            
        course = db.session.query(Course).filter_by(
            id=course_id,
            created_date=course_date
        ).first()
        if not course:
            return jsonify({
                "message": "Course not found"
            }), HTTPStatus.NOT_FOUND
            
        contract_list = course.contract
        return jsonify(contract_schema.dump(contract_list, many=True)), HTTPStatus.OK

    except Exception as e:
        return jsonify({
            "message": "Unexpected error occurred",
            "error": str(e)
        }), HTTPStatus.INTERNAL_SERVER_ERROR

@contract_bp.get("/manager/search")
@role_required("Manager")
def manager_get_contract():
    try:
        id, error_response, status_code = get_contract_id()
        if not id:
            return error_response, status_code
        
        contract = db.session.get(Contract, id)
        if not contract:
            return jsonify({
                "message": "Contract not found"
            }), HTTPStatus.NOT_FOUND
        
        return jsonify(contract_schema.dump(contract)), HTTPStatus.OK

    except Exception as e:
        db.session.rollback()
        return jsonify({
            "message": "Unexpected error occurred",
            "error": str(e)
        }), HTTPStatus.INTERNAL_SERVER_ERROR