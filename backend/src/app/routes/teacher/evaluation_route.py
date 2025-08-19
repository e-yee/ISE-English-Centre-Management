from flask import Blueprint, request, jsonify, send_from_directory, current_app
from flask_jwt_extended import get_jwt
from app.auth import role_required
from marshmallow import ValidationError
from ...http_status import HTTPStatus
from sqlalchemy.exc import IntegrityError, OperationalError
from ...schemas.evaluation_schema import evaluation_schema
from ...models import Evaluation, Student, Employee, Enrolment, StudentAttendance, Course, Class
from ...models.pdf import generate_report
from extensions import db
import datetime, os
from pathlib import Path

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
    course = db.session.query(Course).filter_by(id=course_id).first()

    if not course:
        return None, jsonify({
            "message": "Course not found"
        }), HTTPStatus.NOT_FOUND
    
    return course, None, None

@evaluation_bp.get("/by-class")
@role_required("Teacher", "Learning Advisor", "Manager")
def get_class_students_with_evaluations():
    try:
        class_id = request.args.get("class_id")
        if not class_id:
            return jsonify({
                "message": "Missing class ID in query params"
            }), HTTPStatus.BAD_REQUEST

        course_id = request.args.get("course_id")
        if not course_id:
            return jsonify({
                "message": "Missing course ID in query params"
            }), HTTPStatus.BAD_REQUEST

        course_date_str = request.args.get("course_date")
        if not course_date_str:
            return jsonify({
                "message": "Missing course date in query params"
            }), HTTPStatus.BAD_REQUEST
        try:
            course_date = datetime.date.fromisoformat(course_date_str)
        except ValueError:
            return jsonify({
                "message": "Invalid course_date format; expected YYYY-MM-DD"
            }), HTTPStatus.BAD_REQUEST

        term = request.args.get("term")
        if not term:
            return jsonify({
                "message": "Missing class term in query params"
            }), HTTPStatus.BAD_REQUEST

        class_ = db.session.get(Class, (class_id, course_id, course_date_str, term))
        if not class_:
            return jsonify({
                "message": "Class not found"
            }), HTTPStatus.NOT_FOUND

        # Collect students in this class
        students = [sa.student for sa in class_.student_attendance]

        # If the caller is a Teacher, restrict to their evaluations; otherwise include all
        jwt_employee_id = get_jwt().get("employee_id")
        teacher_obj, _, _ = validate_teacher(jwt_employee_id)
        teacher_filter_id = teacher_obj.id if teacher_obj else None

        result = []
        for s in students:
            query = (
                db.session.query(Evaluation)
                .filter_by(student_id=s.id, course_id=course_id, course_date=course_date)
            )
            if teacher_filter_id:
                query = query.filter_by(teacher_id=teacher_filter_id)
            evals = query.all()

            eval_payload = [
                {
                    "student_id": e.student_id,
                    "course_id": e.course_id,
                    "course_date": e.course_date.isoformat() if e.course_date else None,
                    "assessment_type": e.assessment_type,
                    "teacher_id": e.teacher_id,
                    "grade": e.grade,
                    "comment": e.comment,
                    "enrolment_id": e.enrolment_id,
                    "evaluation_date": e.evaluation_date.isoformat() if e.evaluation_date else None,
                }
                for e in evals
            ]

            result.append({
                "student": {
                    "id": s.id,
                    "fullname": s.fullname,
                    "contact_info": s.contact_info,
                    "date_of_birth": s.date_of_birth.isoformat() if s.date_of_birth else None,
                },
                "evaluations": eval_payload,
            })

        return jsonify({
            "message": "Class students with evaluations retrieved successfully",
            "data": result,
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

        # TODO: validate_course should check Course model; simplified here to accept provided id
        course_id_value = validated["course_id"]
        
        student, response, status = validate_student(validated["student_id"])
        if not student:
            return response, status
        
        # Check duplicate only; proceed if not exists
        dup, _, _ = validate_evaluation(
            user.id,
            student.id,
            course_id_value,
            validated["course_date"],
            validated["assessment_type"]
        )
        if dup:
            return jsonify({
                "message": "Evaluation already exists"
            }), HTTPStatus.BAD_REQUEST
        
        # Try to infer enrolment_id (optional) if not provided; required by DB
        enrolment_id = validated.get("enrolment_id")
        if not enrolment_id:
            enrol = db.session.query(Enrolment).filter_by(
                student_id=student.id,
                course_id=course_id_value,
                course_date=validated["course_date"]
            ).first()
            if enrol:
                enrolment_id = enrol.id
            else:
                # Fallback: infer via student attendance record for this course/date
                attendance = db.session.query(StudentAttendance).filter_by(
                    student_id=student.id,
                    course_id=course_id_value,
                    course_date=validated["course_date"]
                ).first()
                if attendance:
                    enrolment_id = attendance.enrolment_id
                else:
                    return jsonify({
                        "message": "Enrolment not found for student/course/date"
                    }), HTTPStatus.BAD_REQUEST

        evaluation = Evaluation(
            student_id=student.id,
            course_id=course_id_value,
            course_date=validated["course_date"],
            assessment_type=validated["assessment_type"],
            teacher_id=user.id,
            grade=validated["grade"],
            comment=validated["comment"],
            enrolment_id=enrolment_id,
            evaluation_date=datetime.date.today(),
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
        # Identify the record by composite key from query params
        student_id, response, status = get_student_id()
        if not student_id:
            return response, status

        course_id, response, status = get_course_id()
        if not course_id:
            return response, status

        course_date_str, response, status = get_course_date()
        if not course_date_str:
            return response, status
        try:
            course_date = datetime.date.fromisoformat(course_date_str)
        except ValueError:
            return jsonify({
                "message": "Invalid course_date format; expected YYYY-MM-DD"
            }), HTTPStatus.BAD_REQUEST

        assessment_type, response, status = get_assessment_type()
        if not assessment_type:
            return response, status

        # Teacher from JWT, not from query
        teacher_id = get_jwt().get("employee_id")
        teacher, response, status = validate_teacher(teacher_id)
        if not teacher:
            return response, status

        evaluation, response, status = validate_evaluation(
            teacher_id,
            student_id,
            course_id,
            course_date,
            assessment_type
        )
        
        if not evaluation:
            return response, status

        # Only allow updating mutable fields
        payload = request.get_json(silent=True) or {}
        if not isinstance(payload, dict):
            return jsonify({"message": "Invalid JSON body"}), HTTPStatus.BAD_REQUEST
        if "grade" in payload:
            evaluation.grade = payload["grade"]
        if "comment" in payload:
            evaluation.comment = payload["comment"]

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
    

@evaluation_bp.post("/export")
@role_required("Teacher", "Learning Advisor")
def export_evaluation():
    try:
        if not request.is_json:
            return jsonify({"message": "Invalid JSON"}), HTTPStatus.BAD_REQUEST

        data = request.get_json()
        # Process the data and generate the PDF
        student_id, response, status = get_student_id()
        if not student_id:
            return response, status
        
        student_id, response, status = validate_student(student_id)
        if not student_id:
            return response, status

        course_id, response, status = get_course_id()
        if not course_id:
            return response, status

        course_id, response, status = validate_course(course_id)
        if not course_id:
            return response, status
        
        teacher_id, response, status = get_teacher_id()
        if not teacher_id:
            return response, status

        teacher_id, response, status = validate_teacher(teacher_id)
        if not teacher_id:
            return response, status
        
        evaluation = db.session.query(Evaluation).filter_by(
            student_id=student_id.id,
            course_id=course_id.id
        ).all()

        if not evaluation:
            return jsonify({"message": "No evaluation found"}), HTTPStatus.NOT_FOUND
        
        evaluation_to_grade = {
            eval.assessment_type: eval.grade for eval in evaluation
        }

        pdf_data = {
            "student_id": student_id.id,
            "course_id": course_id.id,
            "teacher_id": teacher_id.id,
            "student_name": student_id.fullname,
            "course_name": course_id.name,
            "teacher_name": teacher_id.full_name,
            "evaluation_details": evaluation_to_grade
        }

        app_root = Path(current_app.root_path).parent

        logo_path = app_root / "src" / "test.png"
        assets_dir = app_root / "assets"
    
        assets_dir.mkdir(parents=True, exist_ok=True)

        output_filename = f"evaluation_report_{pdf_data['student_id']}.pdf"
        output_path = assets_dir / output_filename

        generate_report(pdf_data, str(output_path), str(logo_path))

        return send_from_directory(
            assets_dir,
            path=output_filename,
            as_attachment=True,
            download_name=f"evaluation_report_{pdf_data['student_id']}.pdf",
        )

    except Exception as e:
        return jsonify({"message": "An error occurred", "error": str(e)}), HTTPStatus.INTERNAL_SERVER_ERROR