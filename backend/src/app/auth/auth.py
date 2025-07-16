from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from extensions import db, pwd_context
from app.models import Account
from app.schemas.login_schema import login_schema

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

@auth_bp.route('/login', methods=['POST'])
def login():
    json_data = request.get_json()
    login = login_schema.load(json_data)

    user = db.session.query(Account).filter_by(username=login['username']).first()

    if user and pwd_context.verify(login['password'], user.password_hash):
        access_token = create_access_token(identity=user.id)
        refresh_token = create_refresh_token(identity=user.id)
        
        return jsonify({
            'access_token': access_token,
            'refresh_token': refresh_token
        }), 200
    
    return jsonify({'message': 'Invalid credentials'}), 401

@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh_token():
    identity = get_jwt_identity()
    access_token = create_access_token(identity=identity)

    return jsonify({'access_token': access_token}), 200