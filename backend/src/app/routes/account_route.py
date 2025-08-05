from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from sqlalchemy.exc import IntegrityError, OperationalError
from extensions import db, pwd_context
from ..models import Account
from ..schemas.account_schema import account_schema
from ..http_status import HTTPStatus

account_bp = Blueprint("account_bp", __name__, url_prefix="/account")

# Helper Functions
def generate_id():
    last_account = db.session.query(Account).order_by(Account.id.desc()).first()
    
    if not last_account:
        return "ACC001"
    else:
        print(last_account.id)
        prefix = last_account.id[:3]
        num = int(last_account.id[3:]) + 1
        
        return f"{prefix}{num:03}"
    
@account_bp.post("/add")
def add_account():
    try:
        if not request.is_json:
            return jsonify({
                "message": "Missing or invalid JSON"
            }), HTTPStatus.BAD_REQUEST

        json_data = request.get_json()        
        validated = account_schema.load(json_data)
        
        account = Account(
            id=generate_id(),
            employee_id=validated["employee_id"],
            username=validated["username"],
            password_hash=pwd_context.hash(validated["password"])
        )
        db.session.add(account)
        db.session.commit()
        return jsonify(account_schema.dump(account)), HTTPStatus.CREATED
    
    except ValidationError as ve:
        return jsonify({
            "message": "Invalid input", 
            "errors": ve.messages
        }), HTTPStatus.BAD_REQUEST
    
    except IntegrityError as ie:
        db.session.rollback()
        return jsonify({
            "message": "Violate database constraint",
            "error": str(ie.orig)
        }), HTTPStatus.BAD_REQUEST
    
    except OperationalError as oe:
        db.session.rollback()
        return jsonify({
            "message": "Violate database constraint",
            "error": str(oe.orig)
        }), HTTPStatus.BAD_REQUEST
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "message": "Unexpected error occurred",
            "error": str(e)
        }), HTTPStatus.INTERNAL_SERVER_ERROR
    
@account_bp.get("/")
def get_all():
    try:
        accounts = db.session.query(Account).all()
        return jsonify(account_schema.dump(accounts, many=True)), HTTPStatus.OK

    except Exception as e:
        return jsonify({
            "message": "Unexpected error occurred",
            "error": str(e)
        }), HTTPStatus.INTERNAL_SERVER_ERROR

@account_bp.get("/search")
def get_account():
    try:
        id = request.args.get("id")
        if not id:
            return jsonify({
                "message": "Missing account ID in query params"
            }), HTTPStatus.BAD_REQUEST
        
        account = db.session.get(Account, id)
        if not account:
            return jsonify({
                "message": "Account not found"
            }), HTTPStatus.NOT_FOUND
        
        return jsonify({
            "Employee ID": account.employee_id
        }), HTTPStatus.OK
    
    except Exception as e:
        return jsonify({
            "message": "Unexpected error occurred", 
            "error": str(e)
        }), HTTPStatus.INTERNAL_SERVER_ERROR