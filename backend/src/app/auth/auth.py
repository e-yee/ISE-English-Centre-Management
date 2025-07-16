from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity, get_jwt
from extensions import db, pwd_context, jwt
from app.models import Account, TokenBlocklist
from app.schemas.login_schema import login_schema
from marshmallow import ValidationError
from sqlalchemy.exc import SQLAlchemyError

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

@auth_bp.post('/login')
def login():
    try:
        json_data = request.get_json()
        login = login_schema.load(json_data)

        username = login.get('username', '').strip()
        password = login.get('password', '').strip()
        
        if username and password:
            user = db.session.query(Account).filter_by(username=username).first()

            if user and pwd_context.verify(password, user.password_hash):
                access_token = create_access_token(identity=user.id)
                refresh_token = create_refresh_token(identity=user.id)
                
                return jsonify({
                    'access_token': access_token,
                    'refresh_token': refresh_token
                }), 200
            
            return jsonify({'message': 'Invalid credentials'}), 401
        
        return jsonify({'message': 'Username and password are required'}), 400
        
    except ValidationError as ve:
        return jsonify({'message': 'Invalid input', 'errors': ve.messages}), 400

    except SQLAlchemyError as se:
        return jsonify({'message': 'Database error', 'error': str(se)}), 500

    except Exception as e:
        return jsonify({'message': 'Unexpected error occured', 'error': str(e)}), 500

@auth_bp.post('/refresh')
@jwt_required(refresh=True)
def refresh_token():
    identity = get_jwt_identity()
    access_token = create_access_token(identity=identity)

    return jsonify({'access_token': access_token}), 200

@auth_bp.delete('/logout')
@jwt_required()
def logout():
    jti = get_jwt()["jti"]
    db.session.add(TokenBlocklist(jti=jti))
    db.session.commit()
    return jsonify({"message": "Successfully logged out!"}), 200


@jwt.token_in_blocklist_loader
def check_token_in_blocklist(jwt_header, jwt_payload):
    jti = jwt_payload["jti"]
    return db.session.query(TokenBlocklist).filter_by(jti=jti).scalar() is not None
