from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from sqlalchemy.exc import IntegrityError
from extensions import db, pwd_context
from ..models import Account
from ..schemas.account_schema import account_schema, accounts_schema
from ..http_status import HTTPStatus

account_bp = Blueprint('account_bp', __name__, url_prefix='/account')

@account_bp.post('/add')
def add_account():
    try:
        if not request.is_json:
            return jsonify({'message': 'Missing or invalid JSON'}), HTTPStatus.BAD_REQUEST

        json_data = request.get_json()        
        validated = account_schema.load(json_data)
        
        account = Account(
            id=validated['id'],
            employee_id=validated['employee_id'],
            username=validated['username'],
            password_hash=pwd_context.hash(validated['password'])
        )
        db.session.add(account)
        db.session.commit()
        return account_schema.jsonify(account), HTTPStatus.CREATED
    
    except ValidationError as ve:
        return jsonify({'message': 'Invalid input', 'errors': ve.messages}), HTTPStatus.BAD_REQUEST
    
    except IntegrityError as ie:
        db.session.rollback()
        return jsonify({'message': 'Violate database constraint'}), HTTPStatus.BAD_REQUEST
    
@account_bp.get('/')
def get_all():
    accounts = db.session.query(Account).all()
    return accounts_schema.jsonify(accounts), HTTPStatus.OK

@account_bp.get('/search')
def get_account():
    try:
        id = request.args.get('id')
        if not id:
            return jsonify({'message': 'Missing contract ID in query params'}), HTTPStatus.BAD_REQUEST
        
        account = db.session.get(Account, id)
        if not account:
            return jsonify({'message': 'No account found'}), HTTPStatus.CONFLICT
        
        return jsonify({'Employee ID': account.employee_id}), HTTPStatus.OK
    
    except Exception as e:
        return jsonify({'message': 'Unexpected error occured', 'error': str(e)}), HTTPStatus.INTERNAL_SERVER_ERROR