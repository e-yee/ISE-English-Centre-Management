from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity
from app.auth import role_required
from marshmallow import ValidationError
from ...http_status import HTTPStatus
from sqlalchemy.exc import IntegrityError, OperationalError
from ...schemas.teacher.leave_request_schema import leave_request_schema
from ...models import LeaveRequest, Account
from extensions import db

leave_request_bp = Blueprint("leave_request_bp", __name__, url_prefix="/leave_request")
@leave_request_bp.post("/create")
@role_required("Teacher")
def create_request():
    if not request.is_json:
        return jsonify({"message": "Missing or invalid JSON"}), HTTPStatus.BAD_REQUEST
    try:
        identity = get_jwt_identity()
        user = db.session.get(Account, identity)

        if not user or not user.employee_id:
            return jsonify({"message": "Unauthorized or employee profile missing"}), HTTPStatus.FORBIDDEN
        
        data = request.get_json()
        validated = leave_request_schema.load(data)

        existed_request = db.session.query(LeaveRequest).filter_by(
            employee_id=validated["employee_id"],
            start_date=validated["start_date"],
            end_date=validated["end_date"]
        ).first()

        if existed_request:
            return jsonify({"message": "Leave request already exists"}), HTTPStatus.CONFLICT
        
        leave_request = LeaveRequest(
            id=validated["id"],
            employee_id=validated["employee_id"],
            substitute_id=validated["substitute_id"],
            start_date=validated["start_date"],
            end_date=validated["end_date"],
            reason=validated["reason"],
            status=validated["status"],
            created_date=validated["created_date"]
        )

        db.session.add(leave_request)
        db.session.commit()
        return jsonify({"message": "Leave request created successfully"}), HTTPStatus.CREATED
    
    except ValidationError as ve:
        return ({"message": "Invalid input"}, ve.messages), HTTPStatus.BAD_REQUEST
    except IntegrityError as ie:
        return ({"message": "Database error", "error": str(ie.orig)}), HTTPStatus.BAD_REQUEST
    except Exception as e:
        return ({"message": "Unexpected error occurred", "error": str(e)}), HTTPStatus.INTERNAL_SERVER_ERROR

@leave_request_bp.get("/view/<string:teacher_id>")
@role_required("Teacher")
def view_personal_requests(teacher_id):
    if not request.is_json:
        return jsonify({"message": "Missing or invalid JSON"}), HTTPStatus.BAD_REQUEST
    try:
        identity = get_jwt_identity()
        user = db.session.get(Account, identity)

        if not user or not user.employee_id:
            return jsonify({"message": "Unauthorized or employee profile missing"}), HTTPStatus.FORBIDDEN

        requests = db.session.query(LeaveRequest).filter_by(employee_id=teacher_id).all()
        if not requests:
            return jsonify({"message": "No leave requests found"}), HTTPStatus.NOT_FOUND
        
        result = leave_request_schema.dump(requests, many=True)
        return jsonify(result), HTTPStatus.OK
    
    except ValidationError as ve:
        return ({"message": "Invalid input"}, ve.messages), HTTPStatus.BAD_REQUEST
    except IntegrityError as ie:
        return ({"message": "Database error", "error": str(ie.orig)}), HTTPStatus.INTERNAL_SERVER_ERROR
    except Exception as e:
        return ({"message": "Unexpected error occurred", "error": str(e)}), HTTPStatus.INTERNAL_SERVER_ERROR
    
@leave_request_bp.get("/view/<string:request_id>")
@role_required("Teacher", "Manager")
def view_request(request_id):
    if not request.is_json:
        return jsonify({"message": "Missing or invalid JSON"}), HTTPStatus.BAD_REQUEST
    
    try:
        identity = get_jwt_identity()
        user = db.session.get(Account, identity)

        if not user or not user.employee_id:
            return jsonify({"message": "Unauthorized or employee profile missing"}), HTTPStatus.FORBIDDEN
        
        leave_request = db.session.query(LeaveRequest).filter_by(id=request_id).first()
        if not leave_request:
            return jsonify({"message": "Leave request not found"}), HTTPStatus.NOT_FOUND
        
        result = leave_request_schema.dump(leave_request)
        return jsonify(result), HTTPStatus.OK
    
    except ValidationError as ve:
        return ({"message": "Invalid input"}, ve.messages), HTTPStatus.BAD_REQUEST
    except IntegrityError as ie:
        return ({"message": "Database error", "error": str(ie.orig)}), HTTPStatus.BAD_REQUEST
    except Exception as e:
        return ({"message": "Unexpected error occurred", "error": str(e)}), HTTPStatus.INTERNAL_SERVER_ERROR
    
@leave_request_bp.get("/view")
@role_required("Manager")
def view_all_requests():
    if not request.is_json:
        return jsonify({"message": "Missing or invalid JSON"}), HTTPStatus.BAD_REQUEST
    try:
        identity = get_jwt_identity()
        user = db.session.get(Account, identity)

        if not user or not user.employee_id:
            return jsonify({"message": "Unauthorized or employee profile missing"}), HTTPStatus.FORBIDDEN
        
        requests = db.session.query(LeaveRequest).all()
        if not requests:
            return jsonify({"message": "Leave request not found"}), HTTPStatus.NOT_FOUND

        result = leave_request_schema.dump(requests, many=True)
        return jsonify(result), HTTPStatus.OK
    
    except ValidationError as ve:
        return ({"message": "Invalid input"}, ve.messages), HTTPStatus.BAD_REQUEST
    except IntegrityError as ie:
        return ({"message": "Database error", "error": str(ie.orig)}), HTTPStatus.BAD_REQUEST
    except Exception as e:
        return ({"message": "Unexpected error occurred", "error": str(e)}), HTTPStatus.INTERNAL_SERVER_ERROR
    

@leave_request_bp.put("/update/<string:request_id>")
@role_required("Teacher")
def update_request(request_id):
    if not request.is_json:
        return jsonify({"message": "Missing or invalid JSON"}), HTTPStatus.BAD_REQUEST
    try:
        identity = get_jwt_identity()
        user = db.session.get(Account, identity)

        if not user or not user.employee_id:
            return jsonify({"message": "Unauthorized or employee profile missing"}), HTTPStatus.FORBIDDEN
        
        data = request.get_json()
        validated = leave_request_schema.load(data)

        leave_request = db.session.query(LeaveRequest).filter_by(id=request_id, employee_id=user.employee_id).first()
        if not leave_request:
            return jsonify({"message": "Leave request not found"}), HTTPStatus.NOT_FOUND
        
        if leave_request.status != "Not Approved":
            return jsonify({"message": "Leave request cannot be updated after approval"}), HTTPStatus.FORBIDDEN
        
        leave_request.substitute_id = validated["substitute_id"]
        leave_request.start_date = validated["start_date"]
        leave_request.end_date = validated["end_date"]
        leave_request.reason = validated["reason"]
        leave_request.status = validated["status"]
        leave_request.created_date = validated["created_date"]

        db.session.commit()
        return jsonify({"message": "Leave request updated successfully"}), HTTPStatus.OK
    
    except ValidationError as ve:
        return ({"message": "Invalid input"}, ve.messages), HTTPStatus.BAD_REQUEST
    except IntegrityError as ie:
        db.session.rollback()
        return ({"message": "Database error", "error": str(ie.orig)}), HTTPStatus.BAD_REQUEST
    except OperationalError as oe:
        db.session.rollback()
        return ({"message": "Database connection error", "error": str(oe.orig)}), HTTPStatus.BAD_REQUEST
    except Exception as e:
        return ({"message": "Unexpected error occurred", "error": str(e)}), HTTPStatus.INTERNAL_SERVER_ERROR

