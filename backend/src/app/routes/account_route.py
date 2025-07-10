from flask import Blueprint, request, jsonify
from extensions import db, pwd_context
from app.models import Account
from app.schemas.account_schema import account_schema, accounts_schema
from marshmallow import ValidationError

account_bp = Blueprint('account_bp', __name__, url_prefix='/account')

@account_bp.route('/add', methods=['POST'])
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
        
        return account_schema.jsonify(account), 201
    
    except ValidationError as err:
        return jsonify({"errors": err.messages}), 400
    
@account_bp.route('/accounts', methods=['GET'])
def get_accounts():
    accounts = db.session.query(Account).all()
    return jsonify(accounts_schema.dump(accounts)), 200

@account_bp.route('/account/<string:id>', methods=['GET'])
def get_account(id):
    account = db.session.get(Account, id)
    
    if not account:
        return jsonify({"message": "Account not found"}), 400
    
    return jsonify({"Employee ID": account.employee_id}), 200
    