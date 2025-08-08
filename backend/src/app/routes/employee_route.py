from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt
from marshmallow import ValidationError
from sqlalchemy.exc import IntegrityError, OperationalError
from extensions import db
from ..auth import role_required
from ..http_status import HTTPStatus
from ..models import Employee
from ..schemas.employee_schema import employee_schema, employee_schema

employee_bp = Blueprint("employee_bp", __name__,  url_prefix="/employee")

# Helper Functions
def generate_employee_id():
    last_employee = db.session.query(Employee).order_by(Employee.id.desc()).first()
    
    if not last_employee:
        return "EM001"
    else:
        prefix = last_employee.id[:2]
        employee_number = int(last_employee.id[2:]) + 1
        
        return f"{prefix}{employee_number:03}"
    
# General features
@employee_bp.get("/profile")
@role_required("Teacher", "Learning Advisor", "Manager")
def get_employee():
    try:
        employee_id = get_jwt().get("employee_id")
        employee = db.session.get(Employee, employee_id)
        
        return jsonify(employee_schema.dump(employee)), HTTPStatus.OK
    
    except Exception as e:
        return jsonify({
            "message": "Unexpected error occurred",
            "error": str(e)
        }), HTTPStatus.INTERNAL_SERVER_ERROR
        
@employee_bp.put("/update")
@role_required("Teacher", "Learning Advisor", "Manager")
def update_employee():
    try:
        employee_id = get_jwt().get("employee_id")
        employee = db.session.get(Employee, employee_id)
        if not employee:
            return jsonify({
                "message": "Employee not found"
            }), HTTPStatus.NOT_FOUND
        
        if not request.is_json:
            return jsonify({
                "message": "Missing or invalid JSON"
            }), HTTPStatus.BAD_REQUEST
        
        request_data = request.get_json()
        update_fields = employee_schema.load(request_data, partial=True)
        
        if update_fields.get("role"):
            return jsonify({
                "message": "Permission denied"
            }), HTTPStatus.FORBIDDEN
        
        for key, value in update_fields.items():
            setattr(employee, key, value)
        
        db.session.commit()
        return jsonify({
            "message": "Employee updated successfully"
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

# Manager features
@employee_bp.post("/manager/add")
@role_required("Manager")
def manager_create_employee():
    try:
        if not request.is_json:
            return jsonify({
                "message": "Missing or invalid JSON"
            }), HTTPStatus.BAD_REQUEST
        
        request_data = request.get_json()
        validated_data = employee_schema.load(request_data)
        
        if validated_data["role"] == "Manager":
            return jsonify({
                "message": "Permission denied for adding Manager"
            }), HTTPStatus.FORBIDDEN
        
        employee = Employee(
            id=generate_employee_id(),
            full_name=validated_data["full_name"],
            email=validated_data["email"],
            nickname=validated_data["nickname"],
            philosophy=validated_data["philosophy"],
            achievements=validated_data["achievements"],
            role=validated_data["role"],
            phone_number=validated_data["phone_number"],
            teacher_status=validated_data["teacher_status"]
        )
        db.session.add(employee)
        db.session.commit()
        
        return jsonify(employee_schema.dump(employee)), HTTPStatus.CREATED

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

@employee_bp.get("/manager/")
@role_required("Manager")
def manager_get_employees():
    try:
        employee_list = db.session.query(Employee).all()
        return jsonify(employee_schema.dump(employee_list, many=True)), HTTPStatus.OK

    except Exception as e:
        return jsonify({
            "message": "Unexpected erro occurred",
            "error": str(e)
        }), HTTPStatus.INTERNAL_SERVER_ERROR

@employee_bp.get("/manager/search")
@role_required("Manager")
def manager_get_employee():
    try:
        id = request.args.get("id")
        if not id:
            return jsonify({
                "message": "Missing employee ID in query params"
            }), HTTPStatus.BAD_REQUEST
        
        employee = db.session.get(Employee, id)
        if not employee:
            return jsonify({
                "message": "Employee not found"
            }), HTTPStatus.NOT_FOUND
        
        return jsonify(employee_schema.dump(employee)), HTTPStatus.OK
    
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "message": "Unexpected error occurred",
            "error": str(e)
        }), HTTPStatus.INTERNAL_SERVER_ERROR

@employee_bp.delete("/manager/delete")
@role_required("Manager")
def manager_delete_employee():
    try:
        id = request.args.get("id")
        if not id:
            return jsonify({
                "message": "Missing employee ID in query params"
            }), HTTPStatus.BAD_REQUEST
        
        employee = db.session.get(Employee, id)
        if not employee:
            return jsonify({
                "message": "Employee not found"
            }), HTTPStatus.NOT_FOUND
        
        if employee.role == "Manager":
            return jsonify({
                "message": "Permission denied for deleting Manager"
            }), HTTPStatus.FORBIDDEN
        
        db.session.delete(employee)
        db.session.commit()
        return jsonify({
            "message": "Employee deleted successfully"
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
                
# Teacher features
@employee_bp.get("/teacher/")
@role_required("Teacher", "Learning Advisor", "Manager")
def get_available_teacher():
    try:            
        available_teacher_list = db.session.query(Employee).filter_by(teacher_status="Available")
        return jsonify(employee_schema.dump(available_teacher_list, many=True)), HTTPStatus.OK
    
    except Exception as e:
        return jsonify({
            "message": "Unexpected error occurred",
            "error": str(e)
        }), HTTPStatus.INTERNAL_SERVER_ERROR 
        
# Admin
@employee_bp.post("/add")
def admin_add_employee():
    try:
        if not request.is_json:
            return jsonify({
                "message": "Missing or invalid JSON"
            }), HTTPStatus.BAD_REQUEST
        
        request_data = request.get_json()
        validated_data = employee_schema.load(request_data)
    
        employee = Employee(
            id=generate_employee_id(),
            full_name=validated_data["full_name"],
            email=validated_data["email"],
            nickname=validated_data["nickname"],
            philosophy=validated_data["philosophy"],
            achievements=validated_data["achievements"],
            role=validated_data["role"],
            phone_number=validated_data["phone_number"],
            teacher_status=validated_data["teacher_status"]
        )
        db.session.add(employee)
        db.session.commit()
        
        return jsonify(employee_schema.dump(employee)), HTTPStatus.CREATED

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