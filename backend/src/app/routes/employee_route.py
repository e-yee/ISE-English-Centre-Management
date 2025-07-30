from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from sqlalchemy.exc import IntegrityError
from extensions import db
from ..auth import role_required
from ..http_status import HTTPStatus
from ..models import Employee
from ..schemas.employee_schema import employee_schema, employees_schema

employee_bp = Blueprint("employee_bp", __name__,  url_prefix="/employee")

# General features

# Manager features
@employee_bp.post('/add')
@role_required("Manager")
def add_employee():
    try:
        if not request.is_json:
            return jsonify({
                "message": "Missing or invalid JSON"
            }), HTTPStatus.BAD_REQUEST
        
        json_data = request.get_json()
        validated = employee_schema.load(json_data)
        
        if validated["role"] == "Manager":
            return jsonify({
                "message": "Permission denied for adding manager"
            }), HTTPStatus.FORBIDDEN
        
        employee = Employee(
            id=validated["id"],
            full_name=validated["full_name"],
            email=validated["email"],
            role=validated["role"],
            phone_number=validated["phone_number"],
            teacher_status=validated["teacher_status"]
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
    
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "message": "Unexpected error occured",
            "error": str(e)
        }), HTTPStatus.INTERNAL_SERVER_ERROR
        
# Teacher features
