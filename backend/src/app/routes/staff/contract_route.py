from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity
from marshmallow import ValidationError
from sqlalchemy.exc import IntegrityError 
from extensions import db
from ...auth import role_required
from ...models import Contract, Account
from ...http_status import HTTPStatus
from ...schemas.contract_schema import contract_schema, contracts_schema 

contract_bp = Blueprint('contract_bp', __name__, url_prefix='/contract')

@contract_bp.post('/add')
@role_required('Learning Advisor')
def add_contract():
    if not request.is_json:
        return jsonify({'message': 'Missing or invalid JSON'}), HTTPStatus.BAD_REQUEST
    
    try:
        identity = get_jwt_identity()
        user = db.session.get(Account, identity)
        
        if not user or not user.employee_id:
            return jsonify({'message': 'Unauthorized or employee profile missing'}), HTTPStatus.FORBIDDEN
        
        json_data = request.get_json()
        validated = contract_schema.load(json_data)
        existed_contract = db.session.query(Contract).filter_by(
            student_id=validated['student_id'],
            course_id=validated['course_id'],
            course_date=validated['course_date']
        ).first()
        
        if existed_contract:
            return jsonify({'message': 'Contract existed'}), HTTPStatus.CONFLICT
        
        contract = Contract(
            id=validated['id'],
            student_id=validated['student_id'],
            employee_id=user.employee_id,
            course_id=validated['course_id'],
            course_date=validated['course_date'],
            tuition_fee=validated['tuition_fee'],
            start_date=validated['start_date'],
            end_date=validated['end_date']
        )
        
        db.session.add(contract)
        db.session.commit()
        return jsonify(contract_schema.dump(contract)), HTTPStatus.CREATED
    
    except ValidationError as ve:
        return jsonify({'message': 'Invalid input', 'error': ve.messages}), HTTPStatus.BAD_REQUEST
    
    except IntegrityError as ie:
        db.session.rollback()
        return jsonify({'message': 'Violate database constraint', 'error': str(ie.orig)}), HTTPStatus.BAD_REQUEST
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Unexpected error occured', 'error': str(e)}), HTTPStatus.INTERNAL_SERVER_ERROR
        
@contract_bp.get('/')
@role_required('Learning Advisor')
def get_all():
    try:
        identity = get_jwt_identity()
        user = db.session.get(Account, identity)
        
        if not user or not user.employee_id:
            return jsonify({'message': 'Unauthorized or employee profile missing'}), HTTPStatus.FORBIDDEN
        
        contracts = db.session.query(Contract).filter_by(employee_id=user.employee_id).all()
        return jsonify(contracts_schema.dump(contracts)), HTTPStatus.OK

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Unexpected error occured', 'error': str(e)}), HTTPStatus.INTERNAL_SERVER_ERROR
    
@contract_bp.get('/search')
@role_required('Learning Advisor')
def get_contract():
    try:
        identity = get_jwt_identity()
        user = db.session.get(Account, identity)
        
        if not user or not user.employee_id:
            return jsonify({'message': 'Unauthorized or employee profile missing'}), HTTPStatus.FORBIDDEN
    
        id = request.args.get('id')
        if not id:
            return jsonify({'message': 'Missing contract ID in query params'}), HTTPStatus.BAD_REQUEST
        
        contract = db.session.query(Contract).filter_by(
            id = id,
            employee_id = user.employee_id
        ).first()
        
        if not contract:
            return jsonify({'message': 'Contract not found'}), HTTPStatus.NOT_FOUND
        
        return contract_schema.jsonify(contract), HTTPStatus.OK

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Unexpected error occured','error': str(e)}), HTTPStatus.INTERNAL_SERVER_ERROR
    
@contract_bp.put('/update')
@role_required('Learning Advisor')
def update_contract():
    if not request.is_json:
         return jsonify({'message': 'Missing or invalid JSON'}), HTTPStatus.BAD_REQUEST
     
    try:
        identity = get_jwt_identity()
        user = db.session.get(Account, identity)
        
        if not user or not user.employee_id:
            return jsonify({'message': 'Unauthorized or employee profile missing'}), HTTPStatus.FORBIDDEN

        id = request.args.get('id')
        if not id:
            return jsonify({'message': 'Missing contract ID in query params'}), HTTPStatus.BAD_REQUEST
        
        contract = db.session.query(Contract).filter_by(
            id = id,
            employee_id = user.employee_id
        ).first()
        
        if not contract:
            return jsonify({'message': 'Contract not found'}), HTTPStatus.NOT_FOUND
        
        json_data = request.get_json()
        update_data = contract_schema.load(json_data, partial=True)
        
        if any(field in update_data for field in ['student_id', 'course_id', 'course_date']):
            student_id = update_data.get('student_id', contract.student_id)
            course_id = update_data.get('course_id', contract.course_id)
            course_date = update_data.get('course_date', contract.course_date)

            existed_contract = db.session.query(Contract).filter_by(
                student_id=student_id,
                course_id=course_id,
                course_date=course_date
            ).first()
            
            if existed_contract:
                return jsonify({'message': 'Contract existed'}), HTTPStatus.CONFLICT
        
        for key, value in update_data.items():
            setattr(contract, key, value)
        
        db.session.commit()
        return jsonify({'message': 'Contract updated successfully'}), HTTPStatus.OK

    except IntegrityError as ie:
        db.session.rollback()
        return jsonify({'message': 'Violate database constraint', 'error': str(ie.orig)}), HTTPStatus.BAD_REQUEST
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Unexpected error occured', 'error': str(e)}), HTTPStatus.INTERNAL_SERVER_ERROR

@contract_bp.delete('/delete')
@role_required('Learning Advisor')
def delete_contract():
    try:
        identity = get_jwt_identity()
        user = db.session.get(Account, identity)
        
        if not user or not user.employee_id:
                return jsonify({'message': 'Unauthorized or employee profile missing'}), HTTPStatus.FORBIDDEN
    
        id = request.args.get('id')
        if not id:
            return jsonify({'message': 'Missing contract ID in query params'}), HTTPStatus.BAD_REQUEST
        
        contract = db.session.query(Contract).filter_by(
            id=id,
            employee_id=user.employee_id
        ).first()
        
        if not contract:
            return jsonify({'message': 'Contract not found'}), HTTPStatus.NOT_FOUND
        
        db.session.delete(contract)
        db.session.commit()
        return jsonify({'message': 'Contract deleted successfully'}), HTTPStatus.OK
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Unexpected error occured', 'error': str(e)}), HTTPStatus.INTERNAL_SERVER_ERROR