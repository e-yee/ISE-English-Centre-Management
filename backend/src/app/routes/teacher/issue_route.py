from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity, get_jwt
from app.auth import role_required
from marshmallow import ValidationError
from ...http_status import HTTPStatus
from sqlalchemy.exc import IntegrityError, OperationalError
from ...schemas.teacher.issue_schema import issue_schema
from ...models import Issue, Account, Student, Room, Employee
from extensions import db
import datetime

issue_bp = Blueprint("issue_bp", __name__, url_prefix="/issue")
def generate_id():
    last_id = db.session.query(Issue.id).order_by(Issue.id.desc()).first()

    if not last_id:
        return "ISS001"
    else:
        # last_id is a tuple, so we need to access the first element
        last_id_str = last_id[0]
        prefix = last_id_str[:3]
        last_number = int(last_id_str[3:]) + 1
        return f"{prefix}{last_number:03}"
    
def get_student_issue(student_id):
    student_issue = db.session.query(Issue).filter_by(student_id=student_id).first()
    if not student_issue:
        return None, jsonify({"message": "Student issue not found"}), HTTPStatus.NOT_FOUND

    return student_issue, None, None

def get_room_issue(room_id):
    room_issue = db.session.query(Issue).filter_by(room_id=room_id).first()
    if not room_issue:
        return None, jsonify({"message": "Room issue not found"}), HTTPStatus.NOT_FOUND
    
    return room_issue, None, None

def validate_issue(issue_id):
    issue = db.session.query(Issue).filter_by(id=issue_id).first()
    if not issue:
        return None, jsonify({"message": "Issue not found"}), HTTPStatus.NOT_FOUND
    
    return issue, None, None

def validate_teacher(teacher_id):
    teacher = db.session.query(Employee).filter_by(id=teacher_id, role='Teacher').first()

    if not teacher:
        return None, jsonify({"message": "Teacher not found"}), HTTPStatus.NOT_FOUND
    
    return teacher, None, None

def validate_student(student_id):
    student = db.session.query(Student).filter_by(id=student_id).first()

    if not student:
        return None, jsonify({"message": "Student not found"}), HTTPStatus.NOT_FOUND
    
    return student, None, None

def validate_room(room_id):
    room = db.session.query(Room).filter_by(id=room_id).first()

    if not room:
        return None, jsonify({"message": "Room not found"}), HTTPStatus.NOT_FOUND
    
    return room, None, None

@issue_bp.get("/view")
@role_required("Manager", "Learning Advisor")
def view_issues():
    try:
        issues = db.session.query(Issue).all()
        if not issues:
            return jsonify({"message": "No issues found"}), HTTPStatus.NOT_FOUND
        
        # Ensure we always return an array, even for single items
        issues_data = issue_schema.dump(issues, many=True)
        return jsonify(issues_data), HTTPStatus.OK
    
    except Exception as e:
        return jsonify({
            "message": "Unexpected error occurred", "error": str(e)
        }), HTTPStatus.INTERNAL_SERVER_ERROR
    
@issue_bp.get("/view/<string:teacher_id>")
@role_required("Teacher")
def view_teacher_issues(teacher_id):
    try:
        teacher, response, status = validate_teacher(teacher_id)
        if not teacher:
            return response, status

        issues = db.session.query(Issue).filter_by(teacher_id=teacher.id).all()
        if not issues:
            return jsonify({"message": "No issues found for this teacher"}), HTTPStatus.NOT_FOUND

        # Ensure we always return an array, even for single items
        issues_data = issue_schema.dump(issues, many=True)
        return jsonify(issues_data), HTTPStatus.OK

    except Exception as e:
        return jsonify({
            "message": "Unexpected error occurred", "error": str(e)
        }), HTTPStatus.INTERNAL_SERVER_ERROR

@issue_bp.post("/create")
@role_required("Teacher")
def create_issue():
    try:
        print("=== DEBUG: Starting create_issue ===")
        
        if not request.is_json:
            print("DEBUG: Request is not JSON")
            return jsonify({"message": "Missing or invalid JSON"}), HTTPStatus.BAD_REQUEST
        
        data = request.get_json()
        print(f"DEBUG: Received data: {data}")
        
        try:
            validated = issue_schema.load(data)
            print(f"DEBUG: Validated data: {validated}")
        except ValidationError as ve:
            print(f"DEBUG: Validation error: {ve.messages}")
            return jsonify({
                "message": "Invalid input", "error": ve.messages
            }), HTTPStatus.BAD_REQUEST

        id = get_jwt().get("employee_id")
        print(f"DEBUG: Teacher ID from JWT: {id}")
        
        teacher, error_response, status = validate_teacher(id)
        if not teacher:
            print(f"DEBUG: Teacher validation failed: {error_response}")
            return error_response, status
        print(f"DEBUG: Teacher validated: {teacher.id}")
        
        student = None
        if validated.get("student_id"):
            print(f"DEBUG: Validating student_id: {validated['student_id']}")
            student, error_response, status = validate_student(validated["student_id"])
            if not student and validated["issue_type"] == "Student Behavior":
                print("DEBUG: Student validation failed for Student Behavior issue")
                return jsonify({"message": "Student ID is required for Student Behavior issues"}), HTTPStatus.BAD_REQUEST
            if student:
                print(f"DEBUG: Student validated: {student.id}")

        room = None
        if validated.get("room_id"):
            print(f"DEBUG: Validating room_id: {validated['room_id']}")
            room, error_response, status = validate_room(validated["room_id"])
            if not room and validated["issue_type"] == "Technical":
                print("DEBUG: Room validation failed for Technical issue")
                return error_response, status
            if room:
                print(f"DEBUG: Room validated: {room.id}")
        
        issue_id = generate_id()
        print(f"DEBUG: Generated issue ID: {issue_id}")
        
        issue = Issue(
            id=issue_id,
            teacher_id=teacher.id,
            student_id=student.id if student else None,
            room_id=room.id if room else None,
            issue_type=validated["issue_type"],
            issue_description=validated["issue_description"]
        )
        
        print(f"DEBUG: Created issue object: {issue.id}, {issue.teacher_id}, {issue.student_id}, {issue.room_id}, {issue.issue_type}")

        db.session.add(issue)
        db.session.commit()
        print("DEBUG: Issue saved to database successfully")

        return jsonify(issue_schema.dump(issue)), HTTPStatus.CREATED

    except Exception as e:
        print(f"DEBUG: Unexpected error: {str(e)}")
        return jsonify({
            "message": "Unexpected error occurred", "error": str(e)
        }), HTTPStatus.INTERNAL_SERVER_ERROR
    except IntegrityError as ie:
        return jsonify({
            "message": "Database error", "error": str(ie.orig)
        }), HTTPStatus.BAD_REQUEST
    
    except OperationalError as oe:
        return jsonify({
            "message": "Database operation error", "error": str(oe.orig)
        }), HTTPStatus.BAD_REQUEST

@issue_bp.put("/update/<string:issue_id>")
@role_required("Manager", "Learning Advisor")
def resolve_issue(issue_id):
    try:
        issue, error_response, status = validate_issue(issue_id)
        if not issue:
            return error_response, status

        if not request.is_json:
            return jsonify({"message": "Missing or invalid JSON"}), HTTPStatus.BAD_REQUEST

        issue = db.session.query(Issue).filter_by(id=issue_id).first()
        if not issue:
            return jsonify({"message": "Issue not found"}), HTTPStatus.NOT_FOUND
        
        issue.status = "Done"

        db.session.commit()

        return jsonify(issue_schema.dump(issue)), HTTPStatus.OK

    except ValidationError as ve:
        return jsonify({
            "message": "Invalid input", "error": ve.messages
        }), HTTPStatus.BAD_REQUEST
    
    except IntegrityError as ie:
        db.session.rollback()
        return jsonify({
            "message": "Database error", "error": str(ie.orig)
        }), HTTPStatus.BAD_REQUEST
    
    except OperationalError as oe:
        db.session.rollback()
        return jsonify({
            "message": "Database operation error", "error": str(oe.orig)
        }), HTTPStatus.BAD_REQUEST

    except Exception as e:
        db.session.rollback()
        return jsonify({
            "message": "Unexpected error occurred", "error": str(e)
        }), HTTPStatus.INTERNAL_SERVER_ERROR