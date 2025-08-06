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
def generate_id():
    last_contract = db.session.query(Contract).order_by(Contract.id.desc()).first()
    
    if not last_contract:
        return "CON001"
    else:
        prefix = last_contract.id[:3]
        num = int(last_contract.id[3:]) + 1
        
        return f"{prefix}{num:03}"

def generate_enrolment_id():
    last_enrolment = db.session.query(Enrolment).order_by(Enrolment.id.desc()).first()
    
    if not last_enrolment:
        return "ENR001"
    else:
        prefix = last_enrolment.id[:3]
        num = int(last_enrolment.id[3:]) + 1
        
        return f"{prefix}{num:03}"
    
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

def validate_contract(contract_id):
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

def check_existed_contract(student_id, course_id, course_date):
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
def la_add_contract():
    try:        
        if not request.is_json:
            return jsonify({
                "message": "Missing or invalid JSON"
            }), HTTPStatus.BAD_REQUEST
        
        json_data = request.get_json()
        validated = contract_schema.load(json_data)
        
        student, response, status = validate_student(validated["student_id"])
        if not student:
            return response, status

        course, response, status = validate_course(validated["course_id"], validated["course_date"])
        if not course:
            return response, status
        
        result, response, status = check_existed_contract(validated["student_id"], validated["course_id"], validated["course_date"])
        if not result:
            return response, status
        
        employee_id = get_jwt().get("employee_id")
        contract = Contract(
            id=generate_id(),
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
def la_get_all_contracts_from_course():
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
            
        contracts = course.contract
        return jsonify(contract_schema.dump(contracts, many=True)), HTTPStatus.OK

    except Exception as e:
        db.session.rollback()
        return jsonify({
            "message": "Unexpected error occurred",
            "error": str(e)
        }), HTTPStatus.INTERNAL_SERVER_ERROR
    
@contract_bp.get("/learningadvisor/search")
@role_required("Learning Advisor")
def la_get_contract():
    try:
        id, response, status = get_contract_id()
        if not id:
            return response, status
        
        contract, response, status = validate_contract(id)
        if not contract:
            return response, status
        
        return jsonify(contract_schema.dump(contract)), HTTPStatus.OK

    except Exception as e:
        db.session.rollback()
        return jsonify({
            "message": "Unexpected error occurred",
            "error": str(e)
        }), HTTPStatus.INTERNAL_SERVER_ERROR
    
@contract_bp.put("/learningadvisor/update")
@role_required("Learning Advisor")
def la_update_contract():
    try:
        id, response, status = get_contract_id()
        if not id:
            return response, status
        
        contract, response, status = validate_contract(id)
        if not contract:
            return response, status
        
        if not request.is_json:
            return jsonify({
                "message": "Missing or invalid JSON"
            }), HTTPStatus.BAD_REQUEST
        
        json_data = request.get_json()
        update_data = contract_schema.load(json_data, partial=True)
        
        student_id = update_data.get("student_id", contract.student_id)
        course_id = update_data.get("course_id", contract.course_id)
        course_date = update_data.get("course_date", contract.course_date)
        
        enrolment = db.session.query(Enrolment).filter_by(contract_id=contract.id).first()
        
        if student_id != contract.student_id:
            student, response, status = validate_student(student_id)
            if not student:
                return response, status
            
            setattr(enrolment, "student_id", student_id)
                    
        if course_id != contract.course_id or course_date != contract.course_date:
            course, response, status = validate_course(course_id, course_date)
            if not course:
                return response, status
            
            setattr(contract, "start_date", course.start_date)
            setattr(contract, "end_date", course.end_date)
            setattr(contract, "tuition_fee", course.fee)
            
            setattr(enrolment, "course_id", course_id)
            setattr(enrolment, "course_date", course_date)
            setattr(enrolment, "enrolment_date", course.start_date)

        result, response, status = check_existed_contract(student_id, course_id, course_date)
        if not result:
            return response, status
        
        for key, value in update_data.items():
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
def la_delete_contract():
    try:
        id, response, status = get_contract_id()
        if not id:
            return response, status
        
        contract, response, status = validate_contract(id)
        if not contract:
            return response, status
        
        db.session.delete(contract)
        
        enrolment = db.session.query(Enrolment).filter_by(contract_id=contract.id).first()
        db.session.delete(enrolment)
        
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
def manager_get_all_contracts_from_course():
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
            
        contracts = course.contract
        return jsonify(contract_schema.dump(contracts, many=True)), HTTPStatus.OK

    except Exception as e:
        return jsonify({
            "message": "Unexpected error occurred",
            "error": str(e)
        }), HTTPStatus.INTERNAL_SERVER_ERROR

@contract_bp.get("/manager/search")
@role_required("Manager")
def manager_get_contract():
    try:
        id, response, status = get_contract_id()
        if not id:
            return response, status
        
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