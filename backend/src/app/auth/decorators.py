from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from functools import wraps
from flask import jsonify
from models.user_model import User

def role_required(*allowed_roles):
    def wrapper(fn):
        @wraps(fn)
        def decorators(*args, **kwargs):
            verify_jwt_in_request()
            identity = get_jwt_identity()
            user = User.query.get(identity["id"])

            if not user or not user.employee:
                return jsonify({'message': 'No employee profile linked to this user'}), 403

            if user.employee.role not in allowed_roles:
                return jsonify({'message': f'Access denied for {user.employee.role}'}), 403
            
            return fn(*args, **kwargs)
        return decorators
    return wrapper

