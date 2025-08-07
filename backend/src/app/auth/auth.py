from flask import Blueprint, request, jsonify
from flask_mail import Message
from flask_jwt_extended import create_access_token, jwt_required, get_jwt
from itsdangerous import URLSafeTimedSerializer
from marshmallow import ValidationError
from sqlalchemy.exc import SQLAlchemyError
from extensions import db, pwd_context, jwt, mail
from ..models import Account, TokenBlocklist, Employee
from ..schemas.login_schema import login_schema
from ..http_status import HTTPStatus
from config import Config

auth_bp = Blueprint("auth", __name__, url_prefix="/auth")

@auth_bp.post("/login")
def login():
    try:
        if not request.is_json:
            return jsonify({
                "message": "Missing or invalid JSON"
            }), HTTPStatus.BAD_REQUEST
        
        request_data = request.get_json()
        login = login_schema.load(request_data)

        username = login.get("username", "").strip()
        password = login.get("password", "").strip()
        
        if username and password:
            user = db.session.query(Account).filter_by(username=username).first()

            if user and pwd_context.verify(password, user.password_hash):
                employee_role = user.employee.role
                employee_id = user.employee.id
                access_token = create_access_token(
                    identity=user.id, 
                    additional_claims={
                        "employee_id": employee_id,
                        "role": employee_role
                    }
                )

                return jsonify({
                    "access_token": access_token
                }), HTTPStatus.OK
            
            return jsonify({
                "message": "Invalid credentials"
            }), HTTPStatus.UNAUTHORIZED
        
        return jsonify({
            "message": "Username and password are required"
        }), HTTPStatus.BAD_REQUEST
        
    except ValidationError as ve:
        return jsonify({
            "message": "Invalid input", 
            "errors": ve.messages
        }), HTTPStatus.BAD_REQUEST

    except SQLAlchemyError as se:
        return jsonify({
            "message": "Database error", 
            "error": str(se)
        }), HTTPStatus.INTERNAL_SERVER_ERROR

    except Exception as e:
        return jsonify({
            "message": "Unexpected error occured", 
            "error": str(e)
        }), HTTPStatus.INTERNAL_SERVER_ERROR   

@jwt.invalid_token_loader
def invalid_token_callback(reason):
    return jsonify({
        "message": "Token is invalid or expired", 
        "error": reason
    }), HTTPStatus.UNAUTHORIZED

@auth_bp.delete("/logout")
@jwt_required()
def logout():
    token = get_jwt()
    jti = token["jti"]
    db.session.add(TokenBlocklist(jti=jti))
    db.session.commit()
    
    return jsonify({
        "message": "Successfully logged out!"
    }), HTTPStatus.OK

@jwt.token_in_blocklist_loader
def check_token_in_blocklist(jwt_header, jwt_payload):
    jti = jwt_payload["jti"]
    token = db.session.query(TokenBlocklist).filter_by(jti=jti).scalar()
    
    return token is not None

serializer = URLSafeTimedSerializer(Config.SECRET_KEY)
salt = "password-reset"

@auth_bp.post("/request_reset")
def request_reset_password():
    try:
        if not request.is_json:
            return jsonify({
                "message": "Missing or invalid JSON"
            }), HTTPStatus.BAD_REQUEST
        
        email = request.get_json().get("email")
        if not email:
            return jsonify({
                "message": "Missing email field in JSON"
            }), HTTPStatus.BAD_REQUEST
        
        employee = db.session.query(Employee).filter_by(email=email).first()
        if not employee:
            return jsonify({
                "message": "Email not found"
            }), HTTPStatus.NOT_FOUND
        
        url_prefix = "localhost:5000/auth/reset"
        token = serializer.dumps(email, salt=salt)
        reset_link = url_prefix + f"?token={token}"
        msg = Message(
            "Reset Your Password",
            recipients=[email]
        )
        msg.body = f"Click the link to reset your password: {reset_link}"
        mail.send(msg)
        
        return jsonify({
            "message": "Code has been sent"
        }), HTTPStatus.OK
        
    except Exception as e:
        return jsonify({
            "message": "Unexpected error occurred", 
            "error": str(e)
        }), HTTPStatus.INTERNAL_SERVER_ERROR

@auth_bp.put("/reset")
def reset_password():
    try:
        if not request.is_json:
            return jsonify({
                "message": "Missing or invalid JSON"
            }), HTTPStatus.BAD_REQUEST
        
        token = request.args.get("token")
        if not token:
            return jsonify({
                "message": "Missing token"
            }), HTTPStatus.BAD_REQUEST
        
        email = serializer.loads(token, salt=salt, max_age=300)
        employee = db.session.query(Employee).filter_by(email=email).first()
        if not employee:
            return jsonify({
                "message": "Email not found"
            }), HTTPStatus.BAD_REQUEST
        
        new_password = request.get_json().get("new_password")
        if not new_password:
            return jsonify({
                "message": "Missing new password"
            }), HTTPStatus.BAD_REQUEST
    
        account = employee.account
        setattr(account, "password_hash", pwd_context.hash(new_password))
        
        db.session.commit()
        
        return jsonify({
            "message": "Password reset successfully"
        }), HTTPStatus.OK
    
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "message": "Unexpected error occurred",
            "error": str(e)
        }), HTTPStatus.INTERNAL_SERVER_ERROR