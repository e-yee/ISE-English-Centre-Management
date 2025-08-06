from flask import Blueprint, request, jsonify
from app.auth import role_required
from ...http_status import HTTPStatus
from marshmallow import ValidationError
from sqlalchemy.exc import IntegrityError
from ...models import Employee, Contract, Course, Student
from extensions import db
from sqlalchemy import func
from flask_jwt_extended import get_jwt_identity, get_jwt
import datetime

dashboard_bp = Blueprint("dashboard_bp", __name__, url_prefix="/dashboard")

def validate_manager(id):
    manager = db.session.query(Employee).filter_by(id=id, role='Manager').first()
    if not manager:
        return None, jsonify({
            "message": "Manager not found"
        }), HTTPStatus.NOT_FOUND
    
    return manager, None, None

@dashboard_bp.get("/statistics")
@role_required("Manager")
def overview_statistics():
    try:
        id = get_jwt().get("employee_id")
        manager, error_response, status = validate_manager(id)
        if not manager:
            return error_response, status
        
        total_employees = db.session.query(Employee).count()
        total_teachers = db.session.query(Employee).filter_by(role='Teacher').count()
        total_learning_advisors = db.session.query(Employee).filter_by(role='Learning Advisor').count()
        total_students = db.session.query(Student).count()
        paid_contracts = db.session.query(Contract).with_entities(Contract.tuition_fee).filter(
            Contract.status == 'Paid'
        ).all()
        total_revenue = sum([fee[0] for fee in paid_contracts]) if paid_contracts else 0

        return jsonify({
            "total_employees": total_employees,
            "total_teachers": total_teachers,
            "total_learning_advisors": total_learning_advisors,
            "total_students": total_students,
            "total_revenue": total_revenue
        }), HTTPStatus.OK

    except Exception as e:
        return jsonify({
            "message": str(e)
        }), HTTPStatus.INTERNAL_SERVER_ERROR

@dashboard_bp.get("/statistics/students")
@role_required("Manager")
def student_statistics():
    pass

@dashboard_bp.get("/statistics/teachers")
@role_required("Manager")
def teacher_statistics():
    pass

@dashboard_bp.get("/statistics/revenue")
@role_required("Manager")
def revenue_statistics():
    pass