from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity
from app.auth import role_required
from marshmallow import ValidationError
from http_status import HTTPStatus
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
from ...schemas.evaluation_schema import evaluation_schema
from ...models import Evaluation, Account
from extensions import db

evaluation_bp = Blueprint('evaluation_bp', __name__, url_prefix='/evaluation')

@evaluation_bp.route('/add', methods=['POST'])
@role_required('Teacher')
def add_evaluation():
    if not request.is_json:
        return jsonify({'message': 'Missing or invalid JSON'}), HTTPStatus.BAD_REQUEST
    try:
        identity = get_jwt_identity()
        user = db.session.get(Account, identity)

        if not user or not user.employee_id:
            return jsonify({'message': 'Unauthorized or employee profile missing'}), HTTPStatus.FORBIDDEN
        
        data = request.get_json()
        validated = evaluation_schema.load(data)

        existed_evaluation = db.session.query(Evaluation).filter_by(
            student_id=validated['student_id'],
            course_id=validated['course_id'],
            course_date=validated['course_date'],
            assessment_type=validated['assessment_type']
        ).first()

        if existed_evaluation:
            return jsonify({'message': 'Evaluation already exists'}), HTTPStatus.CONFLICT
        
        evaluation = Evaluation(
            student_id=validated['student_id'],
            course_id=validated['course_id'],
            course_date=validated['course_date'],
            assessment_type=validated['assessment_type'],
            teacher_id=user.employee_id,
            grade=validated['grade'],
            comment=validated['comment'],
            enrolment_id=validated['enrolment_id'],
            evaluation_date=validated['evaluation_date']
        )

        db.session.add(evaluation)
        db.session.commit()
    
    except ValidationError as ve:
        return ({'message': 'Invalid input'}, ve.messages), HTTPStatus.BAD_REQUEST
    except SQLAlchemyError as se:
        return ({'message': 'Database error', 'error': str(se)}), HTTPStatus.INTERNAL_SERVER_ERROR
    except Exception as e:
        return ({'message': 'Unexpected error occurred', 'error': str(e)}), HTTPStatus.INTERNAL_SERVER_ERROR



@evaluation_bp.route('/view', methods=['GET'])
@role_required('Teacher', 'Learning Advisor')
def view_evaluation():
    try:
        identity = get_jwt_identity()
        user = db.session.get(Account, identity)

        if not user or not user.employee_id:
            return jsonify({'message': 'Unauthorized or employee profile missing'}), HTTPStatus.FORBIDDEN

        evaluations = db.session.query(Evaluation).all()
        return jsonify([evaluation_schema.dump(evaluation) for evaluation in evaluations]), HTTPStatus.OK
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Unexpected error occurred', 'error': str(e)}), HTTPStatus.INTERNAL_SERVER_ERROR
    

@evaluation_bp.route('/update/<int:evaluation_id>', methods=['PUT'])
@role_required('Teacher')
def update_evaluation(evaluation_id):
    try:
        identity = get_jwt_identity()
        user = db.session.get(Account, identity)

        if not user or not user.employee_id:
            return jsonify({'message': 'Unauthorized or employee profile missing'}), HTTPStatus.FORBIDDEN

        data = request.get_json()
        validated = evaluation_schema.load(data)

        evaluation = db.session.query(Evaluation).filter_by(
            id=evaluation_id,
            teacher_id=user.employee_id
        ).first()

        if not evaluation:
            return jsonify({'message': 'Evaluation not found'}), HTTPStatus.NOT_FOUND
        
        evaluation.student_id = validated['student_id']
        evaluation.course_id = validated['course_id']
        evaluation.course_date = validated['course_date']
        evaluation.assessment_type = validated['assessment_type']
        evaluation.teacher_id = user.employee_id
        evaluation.grade = validated['grade']
        evaluation.comment = validated['comment']
        evaluation.enrolment_id = validated['enrolment_id']
        evaluation.evaluation_date = validated['evaluation_date']

        db.session.commit()
        return jsonify(evaluation_schema.dump(evaluation)), HTTPStatus.OK
    
    except ValidationError as ve:
        db.session.rollback()
        return jsonify({'message': 'Invalid input', 'error': ve.messages}), HTTPStatus.BAD_REQUEST
    except SQLAlchemyError as se:
        db.session.rollback()
        return jsonify({'message': 'Database error', 'error': str(se)}), HTTPStatus.INTERNAL_SERVER_ERROR
    except IntegrityError as ie:
        db.session.rollback()
        return jsonify({'message': 'Database constraint violation', 'error': str(ie.orig)}), HTTPStatus.BAD_REQUEST
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Unexpected error occurred', 'error': str(e)}), HTTPStatus.INTERNAL_SERVER_ERROR


@evaluation_bp.route('/delete/<int:evaluation_id>', methods=['DELETE'])
@role_required('Teacher')
def delete_evaluation(evaluation_id):
    try:
        identity = get_jwt_identity()
        user = db.session.get(Account, identity)

        if not user or not user.employee_id:
            return jsonify({'message': 'Unauthorized or employee profile missing'}), HTTPStatus.FORBIDDEN

        evaluation = db.session.query(Evaluation).filter_by(
            id=evaluation_id,
            teacher_id=user.employee_id
        ).first()

        if not evaluation:
            return jsonify({'message': 'Evaluation not found'}), HTTPStatus.NOT_FOUND
        
        db.session.delete(evaluation)
        db.session.commit()
        return jsonify({'message': 'Evaluation deleted successfully'}), HTTPStatus.OK
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Database error', 'error': str(e)}), HTTPStatus.INTERNAL_SERVER_ERROR