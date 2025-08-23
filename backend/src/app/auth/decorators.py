from flask_jwt_extended import verify_jwt_in_request, get_jwt, get_jwt_identity
from functools import wraps
from flask import jsonify
from extensions import db
from ..models import Employee, Account
from ..http_status import HTTPStatus

def role_required(*allowed_roles):
    def wrapper(fn):
        @wraps(fn)
        def decorators(*args, **kwargs):
            verify_jwt_in_request()
            claims = get_jwt()
            user = get_jwt_identity()
            if not user or not claims.get("employee_id"):
                return jsonify({
                    'message': 'No employee profile linked to this user'
                }), HTTPStatus.FORBIDDEN

            if claims.get("role") not in allowed_roles:
                return jsonify({
                    'message': f'Access denied for {claims.get("role")}'
                }), HTTPStatus.FORBIDDEN
            
            return fn(*args, **kwargs)
        return decorators
    return wrapper

