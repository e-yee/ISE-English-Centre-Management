from flask import Blueprint, request, jsonify
from app.auth import role_required
from ...http_status import HTTPStatus
from sqlalchemy.exc import IntegrityError, OperationalError
from ...models import Employee, Contract, Student, LeaveRequest, StaffCheckin, Class, Course
from extensions import db
from sqlalchemy import func, literal, distinct, cast, Integer
from flask_jwt_extended import get_jwt
import datetime

dashboard_bp = Blueprint("dashboard_bp", __name__, url_prefix="/dashboard")

def validate_manager(id):
    manager = db.session.query(Employee).filter_by(id=id, role='Manager').first()
    if not manager:
        return None, jsonify({
            "message": "Manager not found"
        }), HTTPStatus.NOT_FOUND
    
    return manager, None, None

def get_teacher_id():
    teacher_id = request.args.get("teacher_id")
    if not teacher_id:
        return None, jsonify({
            "message": "Teacher ID is required"
        }), HTTPStatus.BAD_REQUEST
    
    return teacher_id, None, None

def validate_teacher(teacher_id):
    teacher = db.session.query(Employee).filter_by(id=teacher_id, role='Teacher').first()
    if not teacher:
        return None, jsonify({
            "message": "Teacher not found"
        }), HTTPStatus.NOT_FOUND
    
    return teacher, None, None

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
        paid_contracts = db.session.query(Contract).filter_by(
            payment_status = 'Paid'
        ).all()
        total_revenue = sum([contract.tuition_fee for contract in paid_contracts]) if paid_contracts else 0

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
    try:
        id = get_jwt().get("employee_id")
        manager, error_response, status = validate_manager(id)
        if not manager:
            return error_response, status
        
        prefix_math = "MTH"
        prefix_english = "ENG"

        math_students = db.session.query(
            func.count(distinct(Contract.student_id))
        ).filter(
            Contract.course_id.like(f"{prefix_math}%")
        ).scalar()

        english_students = db.session.query(
            func.count(distinct(Contract.student_id))
        ).filter(
            Contract.course_id.like(f"{prefix_english}%")
        ).scalar()


        now = datetime.datetime.now()
        student_age = literal(now.year) - func.extract('year', Student.date_of_birth)
        total_students = db.session.query(Student).count()
        elementary_students = db.session.query(Student).filter(student_age < 12).count()
        middle_school_students = db.session.query(Student).filter((student_age < 15) & (student_age >= 12)).count()
        high_school_students = db.session.query(Student).filter((student_age < 18) & (student_age >= 15)).count()
        other_students = db.session.query(Student).filter(student_age >= 18).count()

        return jsonify({
            "total_students": total_students,
            "elementary_students": elementary_students,
            "middle_school_students": middle_school_students,
            "high_school_students": high_school_students,
            "other_students": other_students,
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
    try:
        id = get_jwt().get("employee_id")
        manager, error_response, status = validate_manager(id)
        if not manager:
            return error_response, status

        total_teachers = db.session.query(Employee).filter_by(role='Teacher').count()

        return jsonify({
            "total_teachers": total_teachers
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

@dashboard_bp.get("/statistics/teachers/details")
@role_required("Manager")
def teacher_detail_statistics():
    try:
        id = get_jwt().get("employee_id")
        manager, error_response, status = validate_manager(id)
        if not manager:
            return error_response, status
        
        teacher_id, error_response, status = get_teacher_id()
        if not teacher_id:
            return error_response, status

        teacher, error_response, status = validate_teacher(teacher_id)
        if not teacher:
            return error_response, status

        leave_counts = db.session.query(LeaveRequest).filter_by(
            employee_id = teacher_id,
            status = 'Approved'
        ).count()

        teaching_hours = 1.5

        late_counts = db.session.query(StaffCheckin).filter_by(
                employee_id = teacher_id,
                status = 'Late'
        ).count() or 0

        on_time_counts = db.session.query(StaffCheckin).filter_by(
                employee_id = teacher_id,
                status = 'Checked In'
        ).count() or 0

        total_counts  = late_counts + on_time_counts

        late_percentage = (late_counts / total_counts * 100) if total_counts > 0 else 0
        on_time_percentage = (on_time_counts / total_counts * 100) if total_counts > 0 else 0
        
        total_math_courses = db.session.query(Class).join(Course).filter(
            Course.id == Class.course_id,
            Course.id.like("MTH%"),
            Class.teacher_id == teacher_id
        ).count()

        total_math_hours = total_math_courses * teaching_hours

        total_english_courses = db.session.query(Class).join(Course).filter(
            Course.id == Class.course_id,
            Course.id.like("ENG%"),
            Class.teacher_id == teacher_id
        ).count()

        total_english_hours = total_english_courses * teaching_hours

        return jsonify({
            "leave_counts": leave_counts,
            "late_counts": late_counts,
            "on_time_counts": on_time_counts,
            "total_counts": total_counts,
            "late_percentage": late_percentage,
            "on_time_percentage": on_time_percentage,
            "total_math_hours": total_math_hours,
            "total_english_hours": total_english_hours
        })

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

        for year in range(start_year, current_year + 1):
            revenue_by_year[year % start_year] = db.session.query(cast(func.sum(Contract.tuition_fee), Integer)).filter(
                Contract.payment_status == 'Paid',
                func.extract('year', Contract.start_date) == year
            ).scalar() or 0

        return jsonify({
            "revenue_by_year": revenue_by_year
        }), HTTPStatus.OK

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