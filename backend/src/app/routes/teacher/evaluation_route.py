from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity, get_jwt
from app.auth import role_required
from marshmallow import ValidationError
from ...http_status import HTTPStatus
from sqlalchemy.exc import IntegrityError, OperationalError
from ...schemas.evaluation_schema import evaluation_schema
from ...models import Evaluation, Account, Student, Employee
from extensions import db

evaluation_bp = Blueprint("evaluation_bp", __name__, url_prefix="/evaluation")

def get_student_id():
    student_id = request.args.get("student_id")
    if not student_id:
        return None, jsonify({
            "message": "Missing student ID in query params"
        }), HTTPStatus.BAD_REQUEST
    
    return student_id, None, None

def get_teacher_id():
    teacher_id = request.args.get("teacher_id")
    if not teacher_id:
        return None, jsonify({
            "message": "Missing teacher ID in query params"
        }), HTTPStatus.BAD_REQUEST
    
    return teacher_id, None, None

def get_course_id():
    course_id = request.args.get("course_id")
    if not course_id:
        return None, jsonify({
            "message": "Missing course ID in query params"
        }), HTTPStatus.BAD_REQUEST
    
    return course_id, None, None

def get_assessment_type():
    assessment_type = request.args.get("assessment_type")
    if not assessment_type:
        return None, jsonify({
            "message": "Missing assessment type in query params"
        }), HTTPStatus.BAD_REQUEST
    
    return assessment_type, None, None

def get_course_date():
    course_date_str = request.args.get("course_date")
    if not course_date_str:
        return None, jsonify({
            "message": "Missing course date in query params"
        }), HTTPStatus.BAD_REQUEST
    
    return course_date_str, None, None

def validate_student(student_id):
    student = db.session.query(Student).filter_by(id=student_id).first()
    if not student:
        return None, jsonify({
            "message": "Student not found"
        }), HTTPStatus.NOT_FOUND
    
    return student, None, None

def validate_evaluation(teacher_id, student_id, course_id, course_date, assessment_type):
    evaluation = db.session.query(Evaluation).filter_by(
        teacher_id=teacher_id,
        student_id=student_id,
        course_id=course_id,
        course_date=course_date,
        assessment_type=assessment_type
    ).first()

    if not evaluation:
        return None, jsonify({
            "message": "Evaluation not found"
        }), HTTPStatus.NOT_FOUND
    
    return evaluation, None, None

def validate_teacher(teacher_id):
    teacher = db.session.query(Employee).filter_by(id=teacher_id, role="Teacher").first()
    if not teacher:
        return None, jsonify({
            "message": "Teacher not found"
        }), HTTPStatus.NOT_FOUND
    
    return teacher, None, None

def validate_course(course_id):
    course = db.session.query(Evaluation).filter_by(course_id=course_id).first()

    if not course:
        return None, jsonify({
            "message": "Course not found"
        }), HTTPStatus.NOT_FOUND
    
    return course, None, None

@evaluation_bp.get("/")
@role_required("Teacher")
def get_evaluation():
    try:
        if not request.is_json:
            return jsonify({
                "message": "Request must be JSON"
            }), HTTPStatus.BAD_REQUEST
        
        data = request.get_json()
        validated = evaluation_schema.load(data)

        id = get_jwt().get("employee_id")
        
        teacher, response, status = validate_teacher(id)
        if not teacher:
            return response, status
        
        evaluations = db.session.query(Evaluation).filter_by(
            teacher_id=id,
        ).all()

        return jsonify({
            "message": "Evaluations retrieved successfully",
            "data": evaluations,
        }), HTTPStatus.OK

    except Exception as e:
        return jsonify({
            "message": "An error occurred",
            "error": str(e)
        }), HTTPStatus.INTERNAL_SERVER_ERROR
    
@evaluation_bp.post("/create")
@role_required("Teacher")
def add_evaluation():
    try:
        if not request.is_json:
            return jsonify({
                "message": "Request must be JSON"
            }), HTTPStatus.BAD_REQUEST
        
        data = request.get_json()
        validated = evaluation_schema.load(data)

        id = get_jwt().get("employee_id")
        user, error_response, status_code = validate_teacher(id)
        if not user:
            return error_response, status_code

        course_id, response, status = validate_course(validated["course_id"])
        if not course_id:
            return response, status
        
        student, response, status = validate_student(validated["student_id"])
        if not student:
            return response, status
        
        result, response, status = validate_evaluation(
            user.id,
            student.id,
            course_id,
            validated["course_date"],
            validated["assessment_type"]
        )

        if not result:
            return response, status
        
        evaluation = Evaluation(
            student_id=student.id,
            course_id=course_id.course_id,
            course_date=validated["course_date"],
            assessment_type=validated["assessment_type"],
            teacher_id=user.id,
            grade=validated["grade"],
            comment=validated["comment"],
            enrolment_id=validated["enrolment_id"],
        )

        db.session.add(evaluation)
        db.session.commit()

        return jsonify(evaluation_schema.dump(evaluation)), HTTPStatus.CREATED

    except ValidationError as ve:
        return jsonify({
            "message": "Validation error",
            "errors": ve.messages
        }), HTTPStatus.BAD_REQUEST
    
    except IntegrityError as ie:
        return jsonify({
            "message": "Integrity error",
            "error": str(ie.orig)
        }), HTTPStatus.BAD_REQUEST
    
    except OperationalError as oe:
        return jsonify({
            "message": "Database connection error",
            "error": str(oe)
        }), HTTPStatus.BAD_REQUEST
    
    except Exception as e:
        return jsonify({
            "message": "An error occurred",
            "error": str(e)
        }), HTTPStatus.INTERNAL_SERVER_ERROR
    
@evaluation_bp.put("/update")
@role_required("Teacher")
def update_evaluation():
    try:
        student_id, response, status = get_student_id()
        if not student_id:
            return response, status

        teacher_id, response, status = get_teacher_id()
        if not teacher_id:
            return response, status
        
        course_id, response, status = get_course_id()
        if not course_id:
            return response, status

        course_date, response, status = get_course_date()
        if not course_date:
            return response, status

        assessment_type, response, status = get_assessment_type()
        if not assessment_type:
            return response, status

        evaluation, response, status = validate_evaluation(
            student_id,
            teacher_id,
            course_id,
            course_date,
            assessment_type
        )
        
        if not evaluation:
            return response, status

        data = request.get_json()
        updated = evaluation_schema.load(data)

        teacher_id = updated.get("teacher_id", evaluation.teacher_id)
        student_id = updated.get("student_id", evaluation.student_id)
        course_id = updated.get("course_id", evaluation.course_id)
        course_date = updated.get("course_date", evaluation.course_date)
        assessment_type = updated.get("assessment_type", evaluation.assessment_type)
        grade = updated.get("grade", evaluation.grade)
        comment = updated.get("comment", evaluation.comment)
        enrolment_id = updated.get("enrolment_id", evaluation.enrolment_id)
        evaluation_date = updated.get("evaluation_date", evaluation.evaluation_date)

        if teacher_id != evaluation.teacher_id:
            result, response, status = validate_teacher(teacher_id)
            if not result:
                return response, status
            
        if student_id != evaluation.student_id:
            result, response, status = validate_student(student_id)
            if not result:
                return response, status
            
        if course_id != evaluation.course_id:
            result, response, status = validate_course(course_id)
            if not result:
                return response, status

        for key, value in request.json.items():
            setattr(evaluation, key, value)

        db.session.commit()

        return jsonify({
            "message": "Evaluation updated successfully",
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
            "message": "An error occurred",
            "error": str(e)
        }), HTTPStatus.INTERNAL_SERVER_ERROR
    
