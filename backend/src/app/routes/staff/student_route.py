from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity
from marshmallow import ValidationError
from sqlalchemy.exc import IntegrityError
from extensions import db
from ...auth import role_required
from ...models import Account, Student, Enrolment
from ...schemas.learning_advisor.student_schema import student_schema, students_schema
from ...schemas.learning_advisor.enrolment_schema import enrolment_schemma, enrolments_schema
from ...http_status import HTTPStatus

student_bp = Blueprint('student_bp', __name__, url_prefix='/student')

@student_bp.post('/add')
@role_required('Learning Advisor')
def add_student(): 
    try:
        identity = get_jwt_identity()
        user = db.session.get(Account, identity)
        
        if not user or not user.employee_id:
            return jsonify({'message': 'Unauthorized or employee profile missing'}), HTTPStatus.FORBIDDEN
        
        if not request.is_json:
            return jsonify({'message': 'Missing or invalid JSON'}), HTTPStatus.BAD_REQUEST
        
        json_data = request.get_json()
        validated = student_schema.load(json_data)
        
        student = Student(
            id=validated['id'],
            fullname=validated['fullname'],
            contact_info=validated['contact_info'],
            date_of_birth=validated['date_of_birth']
        )
        
        db.session.add(student)
        db.session.commit()
        return jsonify(student_schema.dump(student)), HTTPStatus.CREATED
   
    except ValidationError as ve:
        return jsonify({'message': 'Invalid input', 'error': ve.messages}), HTTPStatus.BAD_REQUEST
    
    except IntegrityError as ie:
        db.session.rollback()
        return jsonify({'message': 'Violate database constraint', 'error': str(ie.orig)}), HTTPStatus.BAD_REQUEST
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Unexpected error occured', 'error': str(e)}), HTTPStatus.INTERNAL_SERVER_ERROR

@student_bp.get('/')
@role_required('Learning Advisor')
def get_all():
    try:
        identity = get_jwt_identity()
        user = db.session.get(Account, identity)
        
        if not user or not user.employee_id:
            return jsonify({'message', 'Unauthorised or missing employee profile'}), HTTPStatus.FORBIDDEN
        
        students = db.session.query(Student).all()
        return students_schema.jsonify(students)
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Unexpected error occured', 'error': str(e)}), HTTPStatus.INTERNAL_SERVER_ERROR

@student_bp.get('/search')
@role_required('Learning Advisor')
def get_student():
    try:
        identity = get_jwt_identity()
        user = db.session.get(Account, identity)
        if not user or not user.employee_id:
            return jsonify({'message': 'Unauthorised or missing employee profile'}), HTTPStatus.FORBIDDEN
        
        id = request.args.get('id')
        if not id:
            return jsonify({'message': 'Missing student ID in query params'}), HTTPStatus.BAD_REQUEST
        
        student = db.session.get(Student, id)
        if not student:
            return jsonify({'message': 'Student not found'}), HTTPStatus.NOT_FOUND

        return student_schema.jsonify(student), HTTPStatus.OK

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Unexpected error occured'}), HTTPStatus.INTERNAL_SERVER_ERROR

@student_bp.update('/update')
@role_required('Learning Advisor')
def update_student():
    try:
        identity = get_jwt_identity()
        user = db.session.get(Account, identity)
        if not user or not user.employee_id:
            return jsonify({'message': 'Unauthorised or missing employee profile'}), HTTPStatus.FORBIDDEN
        
        id = request.args.get('id')
        if not id:
            return jsonify({'message': 'Missing student ID in query params'}), HTTPStatus.BAD_REQUEST
        
        student = db.session.get(Student, id)
        if not student:
            return jsonify({'message': 'Student not found'}), HTTPStatus.NOT_FOUND
        
        if not request.is_json:
            return jsonify({'message: Missing or invalid JSON'}), HTTPStatus.BAD_REQUEST
        
        json_data = request.get_json()
        update_data = student_schema.load(json_data, partial=True)
        for key, value in update_data:
            setattr(student, key, value)
        
        db.session.commit()
        return jsonify({'message': 'Student updated successfully'}), HTTPStatus.OK
    
    except ValidationError as ve:
        return jsonify({'message': 'Invalid input', 'error': ve.messages}), HTTPStatus.BAD_REQUEST
    
    except IntegrityError as ie:
        db.session.rollback()
        return jsonify({'message': 'Violate database constraint', 'error': str(ie.orig)}), HTTPStatus.BAD_REQUEST
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Unexpected error occured', 'error': str(e)}), HTTPStatus.INTERNAL_SERVER_ERROR

@student_bp.delete('/delete')
@role_required('Learning Advisor')
def delete_student():
    try:
        identity = get_jwt_identity()
        user = db.session.get(Account, identity)
        if not user or not user.employee_id:
            return jsonify({'message': 'Unauthorised or missing employee profile'}), HTTPStatus.BAD_REQUEST
        
        id = request.args.get('id')
        if not id:
            return jsonify({'message': 'Missing student ID in query params'}), HTTPStatus.BAD_REQUEST
        
        student = db.session.get(Student, id)
        if not student:
            return jsonify({'message': 'Student not found'}), HTTPStatus.NOT_FOUND
        
        db.session.delete(student)
        db.session.commit()
        return jsonify({'message': 'Student deleted successfully'}), HTTPStatus.OK
    
    except IntegrityError as ie:
        db.session.rollback()
        return jsonify({'message': 'Violate database constraint', 'error': str(ie.orig)}), HTTPStatus.BAD_REQUEST

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Unexpected error occured', 'error': str(e)}), HTTPStatus.INTERNAL_SERVER_ERROR
    
