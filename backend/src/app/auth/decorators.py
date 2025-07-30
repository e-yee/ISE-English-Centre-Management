from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
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
            identity = get_jwt_identity()
            
            user = db.session.get(Account, identity)
            if not user or not user.employee_id:
                return jsonify({
                    'message': 'No employee profile linked to this user'
                }), HTTPStatus.FORBIDDEN

            employee = db.session.get(Employee, user.employee_id)
            if employee.role not in allowed_roles:
                return jsonify({
                    'message': f'Access denied for {employee.role}'
                }), HTTPStatus.FORBIDDEN
            
            return fn(*args, **kwargs)
        return decorators
    return wrapper

