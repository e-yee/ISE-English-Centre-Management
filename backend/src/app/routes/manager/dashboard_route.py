from flask import Blueprint, request, jsonify
from app.auth import role_required
from ...http_status import HTTPStatus
from marshmallow import ValidationError
from sqlalchemy.exc import IntegrityError
from ...models import Employee, Contract, Course
from extensions import db
from sqlalchemy import func
from flask_jwt_extended import get_jwt_identity
import datetime

dashboard_bp = Blueprint("dashboard_bp", __name__, url_prefix="/dashboard")

@dashboard_bp.get("/statistics")
@role_required("Manager")
def overall_statistics():
    try:
        if not request.is_json:
            return jsonify({"message": "Missing or invalid JSON"}), HTTPStatus.BAD_REQUEST
        
        now = datetime.datetime.now().date()

        total_employees = db.session.query(Employee).count()
        total_students = db.session.query(Contract).with_entities(func.distinct(Contract.student_id)).count()
        total_revenue = db.session.query(func.sum(Contract.fee).filter(Contract.payment_status == "Paid")).scalar() or 0
        total_courses = db.session.query(Course).filter(Course.end_date >= now).count()

        data = {
            "total_employees": total_employees,
            "total_students": total_students,
            "total_courses": total_courses,
            "total_revenue": total_revenue
        }

        return jsonify(data), HTTPStatus.OK
    except ValidationError as ve:
        return jsonify({
            "message": "Invalid input", 
            "error": ve.messages
        }), HTTPStatus.BAD_REQUEST
    except IntegrityError as ie:
        return jsonify({
            "message": "Database error",
            "error": str(ie.orig)
        }), HTTPStatus.INTERNAL_SERVER_ERROR
    except Exception as e:
        return jsonify({
            "message": "Unexpected error occurred",
            "error": str(e)
        }), HTTPStatus.INTERNAL_SERVER_ERROR
    
