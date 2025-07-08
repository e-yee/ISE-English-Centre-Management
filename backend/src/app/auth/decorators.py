from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from functools import wraps
from flask import jsonify
from app.models import Employee, Account
from app import SessionLocal

def role_required(*allowed_roles):
    def wrapper(fn):
        @wraps(fn)
        def decorators(*args, **kwargs):
            verify_jwt_in_request()
            identity = get_jwt_identity()
            with SessionLocal() as session:
                user = session.query(Account).get(identity["id"])

                if not user or not user.employee_id:
                    return jsonify({'message': 'No employee profile linked to this user'}), 403

                employee = session.query(Employee).get(user.employee_id)
                if employee.role not in allowed_roles:
                    return jsonify({'message': f'Access denied for {employee.role}'}), 403
                
                return fn(*args, **kwargs)
        return decorators
    return wrapper

