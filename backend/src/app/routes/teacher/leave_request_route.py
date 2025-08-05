from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity, get_jwt
from app.auth import role_required
from marshmallow import ValidationError
from ...http_status import HTTPStatus
from sqlalchemy.exc import IntegrityError, OperationalError
from ...schemas.teacher.leave_request_schema import leave_request_schema
from ...models import LeaveRequest, Account, Employee
from extensions import db

leave_request_bp = Blueprint("leave_request_bp", __name__, url_prefix="/leave_request")

def generate_id(teacher_id, start_date, end_date):
    last_request = db.session.query(LeaveRequest).filter_by(
        teacher_id=teacher_id,
        start_date=start_date,
        end_date=end_date
    ).order_by(LeaveRequest.id.desc()).first()

    if not last_request:
        return "LR001"
    else:
        prefix = last_request.id[:2]
        next_number = int(last_request.id[2:]) + 1

        return f"{prefix}{next_number:03}"
    
def get_teacher_id():
    id = request.args.get("teacher_id")

    if not id:
        return None, jsonify({
            "message": "Missing teacher ID in query params"
        }), HTTPStatus.BAD_REQUEST
    
    return id, None, None

def get_leave_request_id():
    id = request.args.get("id")
    if not id:
        return None, jsonify({
            "message": "Missing leave request ID in query params"
        }), HTTPStatus.BAD_REQUEST
    
    return id, None, None

def validate_leave_request(id):
    leave_request = db.session.query(LeaveRequest).filter_by(id=id).first()
    if not leave_request:
        return None, jsonify({
            "message": "Leave request not found"
        }), HTTPStatus.NOT_FOUND
    
    return leave_request, None, None

def validate_employee(employee_id):
    employee = db.session.query(Employee).filter_by(id=employee_id).first()

    if not employee:
        return None, jsonify({
            "message": "Employee not found"
        }), HTTPStatus.NOT_FOUND
    
    return employee, None, None

def validate_substitute(employee_id, substitute_id):
    if employee_id == substitute_id:
        return jsonify({
            "message": "Substitute cannot be the same as the requesting teacher"
        }), HTTPStatus.BAD_REQUEST
    
    substitute = db.session.query(Employee).filter_by(id=substitute_id).first()
    employee = db.session.query(Employee).filter_by(id=employee_id).first()

    if not employee:
        return jsonify({
            "message": "Employee not found"
        }), HTTPStatus.NOT_FOUND

    if not substitute:
        return jsonify({
            "message": "Substitute employee not found"
        }), HTTPStatus.NOT_FOUND
    
    if substitute.role != employee.role:
        return jsonify({
            "message": "Substitute must have the same role as the requesting teacher"
        }), HTTPStatus.BAD_REQUEST
    
    return substitute, None, None

@leave_request_bp.get("/")
@role_required("Manager")
def get_all():
    try:
        leave_requests = db.session.query(LeaveRequest).all()
        return jsonify(leave_request_schema.dump(leave_requests)), HTTPStatus.OK

    except Exception as e:
        return jsonify({
            "message": "Unexpected error occurred", "error": str(e)
        }), HTTPStatus.INTERNAL_SERVER_ERROR
    
@leave_request_bp.post("/create")
@role_required("Teacher", "Learning Advisor")
def add_request():
    try:
        if not request.is_json:
            return jsonify({
                "message": "Missing or invalid JSON"
            }), HTTPStatus.BAD_REQUEST
        
        data = request.get_json()
        validated = leave_request_schema.load(data)

        identity = get_jwt_identity()
        user = db.session.get(Account, identity)

        if not user or not user.employee_id:
            return jsonify({
                "message": "Unauthorized or employee profile missing"
            }), HTTPStatus.FORBIDDEN
        
        result, response, status = validate_employee(validated["teacher_id"])
        if not result:
            return response, status

        result, response, status = validate_substitute(validated["teacher_id"], validated["substitute_id"])
        if not result:
            return response, status
        
        leave_request = LeaveRequest(
            id=generate_id(validated["teacher_id"], validated["start_date"], validated["end_date"]),
            teacher_id=validated["teacher_id"],
            substitute_id=validated["substitute_id"],
            start_date=validated["start_date"],
            end_date=validated["end_date"],
            reason=validated["reason"],
        )

        db.session.add(leave_request)
        db.session.commit()

        return jsonify(leave_request_schema.dump(leave_request)), HTTPStatus.CREATED
    
    except ValidationError as ve:
        return jsonify({
            "message": "Invalid input", "errors": ve.messages
        }), HTTPStatus.BAD_REQUEST

    except IntegrityError as ie:
        return jsonify({
            "message": "Database error", "error": str(ie.orig)
        }), HTTPStatus.BAD_REQUEST
    
    except OperationalError as oe:
        return jsonify({
            "message": "Database connection error", "error": str(oe)
        }), HTTPStatus.BAD_REQUEST
    
    except Exception as e:
        return jsonify({
            "message": "Unexpected error occurred", "error": str(e)
        }), HTTPStatus.INTERNAL_SERVER_ERROR
    
@leave_request_bp.put("/update")
@role_required("Teacher", "Learning Advisor")
def update_request():
    try:
        id, response, status = get_leave_request_id()
        if not id:
            return response, status
        
        leave_request, response, status = validate_leave_request(id)
        if not leave_request:
            return response, status
        
        data = request.get_json()
        updated = leave_request_schema.load(data)

        request_id = updated.get("id", leave_request.id)
        teacher_id = updated.get("teacher_id", leave_request.teacher_id)
        substitute_id = updated.get("substitute_id", leave_request.substitute_id)
        start_date = updated.get("start_date", leave_request.start_date)
        end_date = updated.get("end_date", leave_request.end_date)
        reason = updated.get("reason", leave_request.reason)

        if request_id != leave_request.id:
            result, response, status = validate_leave_request(request_id)
            if not result:
                return response, status
            
        if teacher_id != leave_request.teacher_id:
            result, response, status = validate_employee(teacher_id)
            if not result:
                return response, status
            
        if substitute_id != leave_request.substitute_id:
            result, response, status = validate_substitute(teacher_id, substitute_id)
            if not result:
                return response, status
            
        for key, value in updated.items():
            setattr(leave_request, key, value)

        db.session.commit()

        return jsonify({
            "message": "Leave request updated successfully",
        }), HTTPStatus.OK
    
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
        return jsonify({
            "message": "Unexpected error occurred", "error": str(e)
        }), HTTPStatus.INTERNAL_SERVER_ERROR
    
@leave_request_bp.get("/personal_lr/")
@role_required("Teacher", "Learning Advisor")
def get_personal_leave_requests():
    try:
        id = get_jwt().get("employee_id")
        leave_requests = db.session.query(LeaveRequest).filter_by(teacher_id=id).all()
        return jsonify(leave_request_schema.dump(leave_requests)), HTTPStatus.OK
    except Exception as e:
        return jsonify({
            "message": "Unexpected error occurred", 
            "error": str(e)
        }), HTTPStatus.INTERNAL_SERVER_ERROR
    
@leave_request_bp.put("/approve/<int:leave_request_id>")
@role_required("Manager")
def approve_leave_request(leave_request_id):
    try:
        leave_request = db.session.query(LeaveRequest).filter_by(id=leave_request_id).first()
        if not leave_request:
            return jsonify({
                "message": "Leave request not found"
            }), HTTPStatus.NOT_FOUND
        
        leave_request.status = "Approved"
        db.session.commit()

        return jsonify({
            "message": "Leave request approved successfully"
        }), HTTPStatus.OK
    
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
        return jsonify({
            "message": "Unexpected error occurred", "error": str(e)
        }), HTTPStatus.INTERNAL_SERVER_ERROR
        
        