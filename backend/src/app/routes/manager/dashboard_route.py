from flask import Blueprint, request, jsonify
from app.auth import role_required
from ...http_status import HTTPStatus
from marshmallow import ValidationError
from sqlalchemy.exc import IntegrityError, OperationalError
from ...models import Employee, Contract, Enrolment, Student, Class
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
    
    except IntegrityError as ie:
        return jsonify({
            "message": "Database integrity error",
            "error": str(ie)
        }), HTTPStatus.BAD_REQUEST

    except OperationalError as oe:
        return jsonify({
            "message": "Database operational error",
            "error": str(oe)
        }), HTTPStatus.BAD_REQUEST


@dashboard_bp.get("/statistics/students")
@role_required("Manager")
def student_statistics():
    # Total students, students group by age (Elementary, Middle School, High School), students group by class type (Math/English)
    course_to_subject_map = {
        "Math": ["MTH001", "MTH002", "MTH003", "MTH004", "MTH101", "MTH102", "MTH103"],
        "English": ["ENG001", "ENG002", "ENG003", "ENG004", "ENG005", "ENG006", 
                    "ENG101", "ENG102", "ENG103", "ENG104", "ENG105", "ENG201", 
                    "ENG202", "ENG203", "ENG204", "ENG205"]
    }

    try:
        id = get_jwt().get("employee_id")
        manager, error_response, status = validate_manager(id)
        if not manager:
            return error_response, status
        
        now = datetime.datetime.now()
        verify_age = now.year - datetime.datetime.year(Student.date_of_birth)
        total_students = db.session.query(Student).count()
        elementary_students = db.session.query(Student).filter(verify_age < 12).count()
        middle_school_students = db.session.query(Student).filter(verify_age < 15 and verify_age >= 12).count()
        high_school_students = db.session.query(Student).filter(verify_age < 18 and verify_age >= 15).count()

        math_students = db.session.query(Student.id).join(Enrolment).filter(Enrolment.course_id == course_to_subject_map["Math"]).count()
        english_students = db.session.query(Student.id).join(Enrolment).filter(Enrolment.course_id == course_to_subject_map["English"]).count()

        return jsonify({
            "total_students": total_students,
            "elementary_students": elementary_students,
            "middle_school_students": middle_school_students,
            "high_school_students": high_school_students,
            "math_students": math_students,
            "english_students": english_students
        }), HTTPStatus.OK
    
    except Exception as e:
        return jsonify({
            "message": str(e)
        }), HTTPStatus.INTERNAL_SERVER_ERROR
    
    except IntegrityError as ie:
        return jsonify({
            "message": "Database integrity error",
            "error": str(ie)
        }), HTTPStatus.BAD_REQUEST
    
    except OperationalError as oe:
        return jsonify({
            "message": "Database operational error",
            "error": str(oe)
        }), HTTPStatus.BAD_REQUEST



@dashboard_bp.get("/statistics/teachers")
@role_required("Manager")
def teacher_statistics():
    # Total teachers, teachers group by subject (Math/English)
    course_to_subject_map = {
        "Math": ["MTH001", "MTH002", "MTH003", "MTH004", "MTH101", "MTH102", "MTH103"],
        "English": ["ENG001", "ENG002", "ENG003", "ENG004", "ENG005", "ENG006", 
                    "ENG101", "ENG102", "ENG103", "ENG104", "ENG105", "ENG201", 
                    "ENG202", "ENG203", "ENG204", "ENG205"]
    }

    try:
        id = get_jwt().get("employee_id")
        manager, error_response, status = validate_manager(id)
        if not manager:
            return error_response, status

        total_teachers = db.session.query(Employee).filter_by(role='Teacher').count()
        math_teachers = db.session.query(Employee.id).join(Class).filter(
            Class.course_id == course_to_subject_map["Math"]
        ).distinct().count()
        english_teachers = db.session.query(Employee.id).join(Class).filter(
            Class.course_id == course_to_subject_map["English"]
        ).distinct().count()

        return jsonify({
            "total_teachers": total_teachers,
            "math_teachers": math_teachers,
            "english_teachers": english_teachers
        }), HTTPStatus.OK

    except Exception as e:
        return jsonify({
            "message": str(e)
        }), HTTPStatus.INTERNAL_SERVER_ERROR

    except IntegrityError as ie:
        return jsonify({
            "message": "Database integrity error",
            "error": str(ie)
        }), HTTPStatus.BAD_REQUEST

    except OperationalError as oe:
        return jsonify({
            "message": "Database operational error",
            "error": str(oe)
        }), HTTPStatus.BAD_REQUEST


@dashboard_bp.get("/statistics/revenue")
@role_required("Manager")
def revenue_statistics():
    # Total revenue in each month, each term and each school year
    try:
        id = get_jwt().get("employee_id")
        manager, error_response, status = validate_manager(id)
        if not manager:
            return error_response, status
        
        # Assume the company was found in 2023
        start_year = 2023
        current_year = datetime.datetime.now().year
        revenue_by_year = [0 for _ in range(current_year - start_year + 1)]

        for i in range(1, 13):
            revenue_by_year[i - 1] = [0 for _ in range (1, 3)]

        term_to_month_map = {
            1: [1, 2, 3, 4, 5, 6],
            2: [7, 8, 9, 10, 11, 12],
        }

        for year in range(start_year, current_year + 1):
            revenue_by_year[year / start_year] = db.session.query(func.sum(Contract.tuition_fee)).filter(
                Contract.status == 'Paid',
                func.extract('year', Contract.created_date) == year
            ).scalar() or 0

            for term in range(1, 3):
                revenue_by_year[year / start_year][term - 1] = db.session.query(func.sum(Contract.tuition_fee)).filter(
                    Contract.status == 'Paid',
                    int(func.extract('year', Contract.created_date)) == year,
                    int(func.extract('month', Contract.created_date)) == term_to_month_map[term]
                ).scalar() or 0

    except IntegrityError as ie:
        return jsonify({
            "message": "Database integrity error",
            "error": str(ie.orig)
        }), HTTPStatus.BAD_REQUEST

    except OperationalError as oe:
        return jsonify({
            "message": "Database operational error",
            "error": str(oe)
        }), HTTPStatus.BAD_REQUEST    
    
    except Exception as e:
        return jsonify({
            "message": str(e)
        }), HTTPStatus.INTERNAL_SERVER_ERROR