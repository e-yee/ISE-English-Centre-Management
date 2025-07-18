from flask import Blueprint, request, jsonify
from app.auth import role_required
from marshmallow import ValidationError
from http_status import HTTPStatus
from sqlalchemy.exc import SQLAlchemyError
from ...schemas.attendance_schema import attendance_schema
from ...models import StudentAttendance
from extensions import db

attendance_bp = Blueprint('attendance_bp', __name__, url_prefix='/attendance')

@role_required('Teacher')
@attendance_bp.route('/attendance/<date>', methods=['POST'])
def mark_attendance(date):
    try: 
        data = request.get_json()
        validated = attendance_schema.load(data)

        student = db.session.get(StudentAttendance, validated['student_id'])
        if not student:
            return jsonify({'message': 'Student not found'}), HTTPStatus.NOT_FOUND
        
        attendance = StudentAttendance(
            student_id=validated['student_id'],
            class_id=validated['class_id'],
            course_id=validated['course_id'],
            term=validated['term'],
            enrolment_id=validated['enrolment_id'],
            status="Present"
        )

        db.session.add(attendance)
        db.session.commit()

        return jsonify({'message': 'Attendance marked successfully'}), HTTPStatus.CREATED

    except ValidationError as ve:
        return ({'message': 'Invalid input'}, ve.messages), HTTPStatus.BAD_REQUEST

    except SQLAlchemyError as se:
        return ({'message': 'Database error', 'error': str(se)}), HTTPStatus.INTERNAL_SERVER_ERROR
    
    except Exception as e:
        return ({'message': 'Unexpected error occurred', 'error': str(e)}), HTTPStatus.INTERNAL_SERVER_ERROR
    



@role_required('Teacher', 'Leaning Advisor')
@attendance_bp.route('/view', methods=['GET'])
def view_attendance():
    try:
        student_id = request.args.get('student_id')
        if not student_id:
            return jsonify({'message': 'Student ID is required'}), HTTPStatus.BAD_REQUEST
        
        attendance_records = db.session.query(StudentAttendance).filter_by(student_id=student_id).all()
        if not attendance_records:
            return jsonify({'message': 'No attendance records found for this student'}), HTTPStatus.NOT_FOUND
        
        return jsonify(attendance_schema.dump(attendance_records)), HTTPStatus.OK

    except ValidationError as ve:
        return jsonify({'message': 'Invalid input', 'error': ve.messages}), HTTPStatus.BAD_REQUEST
    
    except SQLAlchemyError as se:
        return jsonify({'message': 'Database error', 'error': str(se)}), HTTPStatus.INTERNAL_SERVER_ERROR

    except Exception as e:
        return jsonify({'message': 'Unexpected error occurred', 'error': str(e)}), HTTPStatus.INTERNAL_SERVER_ERROR 