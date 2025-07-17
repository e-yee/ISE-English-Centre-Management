from flask import Blueprint, request, jsonify
from extensions import db, pwd_context
from ..models import Account
from ..schemas.account_schema import account_schema, accounts_schema
from ..http_status import HTTPStatus
from marshmallow import ValidationError

account_bp = Blueprint('account_bp', __name__, url_prefix='/account')

@account_bp.post('/add')
def add_account():
    try:
        json_data = request.get_json()        
        validated = account_schema.load(json_data)
        
        account = Account(
            id=validated["id"],
            employee_id=validated["employee_id"],
            username=validated["username"],
            password_hash=pwd_context.hash(validated["password"])
        )
        db.session.add(account)
        db.session.commit()
        
        return account_schema.jsonify(account), HTTPStatus.CREATED
    
    except ValidationError as ve:
        return jsonify({"errors": ve.messages}), HTTPStatus.BAD_REQUEST
    
@account_bp.get('/')
def get_all():
    accounts = db.session.query(Account).all()
    return jsonify(accounts_schema.dump(accounts)), HTTPStatus.OK

@account_bp.get('/search')
def get_account():
    try:
        id = request.args.get('id')
        account = db.session.get(Account, id)
        
        if not account:
            return jsonify({"message": "Account not found"}), HTTPStatus.BAD_REQUEST
        
        return jsonify({"Employee ID": account.employee_id}), HTTPStatus.OK
    
    except Exception as e:
        return jsonify({'message': 'Unexpected error occured', 'error': str(e)}), HTTPStatus.INTERNAL_SERVER_ERROR
    