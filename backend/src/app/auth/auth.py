from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt
from extensions import db, pwd_context, jwt
from ..models import Account, TokenBlocklist
from ..schemas.login_schema import login_schema
from marshmallow import ValidationError
from sqlalchemy.exc import SQLAlchemyError
from ..http_status import HTTPStatus

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

@auth_bp.post('/login')
def login():
    try:
        if not request.is_json:
            return jsonify({
                'message': 'Missing or invalid JSON'
            }), HTTPStatus.BAD_REQUEST
        
        json_data = request.get_json()
        login = login_schema.load(json_data)

        username = login.get('username', '').strip()
        password = login.get('password', '').strip()
        
        if username and password:
            user = db.session.query(Account).filter_by(username=username).first()

            if user and pwd_context.verify(password, user.password_hash):
                employee_role = user.employee.role
                access_token = create_access_token(identity=user.id, additional_claims={'role': employee_role})

                return jsonify({
                    'access_token': access_token
                }), HTTPStatus.OK
            
            return jsonify({
                'message': 'Invalid credentials'
            }), HTTPStatus.UNAUTHORIZED
        
        return jsonify({
            'message': 'Username and password are required'
        }), HTTPStatus.BAD_REQUEST
        
    except ValidationError as ve:
        return jsonify({
            'message': 'Invalid input', 
            'errors': ve.messages
        }), HTTPStatus.BAD_REQUEST

    except SQLAlchemyError as se:
        return jsonify({
            'message': 'Database error', 
            'error': str(se)
        }), HTTPStatus.INTERNAL_SERVER_ERROR

    except Exception as e:
        return jsonify({
            'message': 'Unexpected error occured', 
            'error': str(e)
        }), HTTPStatus.INTERNAL_SERVER_ERROR   

@jwt.invalid_token_loader
def invalid_token_callback(reason):
    return jsonify({
        'message': 'Token is invalid or expired', 
        'error': reason
    }), HTTPStatus.UNAUTHORIZED

@auth_bp.delete('/logout')
@jwt_required()
def logout():
    token = get_jwt()
    jti = token['jti']
    db.session.add(TokenBlocklist(jti=jti))
    db.session.commit()
    
    return jsonify({
        'message': 'Successfully logged out!'
    }), HTTPStatus.OK

@jwt.token_in_blocklist_loader
def check_token_in_blocklist(jwt_header, jwt_payload):
    jti = jwt_payload['jti']
    token = db.session.query(TokenBlocklist).filter_by(jti=jti).scalar()
    
    return token is not None
