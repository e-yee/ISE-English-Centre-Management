from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from extensions import db
from ..http_status import HTTPStatus
from ..models import Employee
from ..schemas.employee_schema import employee_schema, employees_schema

employee_bp = Blueprint('employee_bp', __name__,  url_prefix='/employee')

@employee_bp.post('/add')
def add_employee():
    if not request.is_json:
         return jsonify({'message': 'Missing or invalid JSON'}), HTTPStatus.BAD_REQUEST
     
    try:
        json_data = request.get_json()
        validated = employee_schema.load(json_data)
        
        employee = Employee(
            id = validated['id'],
            full_name = validated['full_name'],
            email = validated['email'],
            role = validated['role'],
            phone_number = validated['phone_number'],
            teacher_status = validated['teacher_status']
        )
        db.session.add(employee)
        db.session.commit()
        
        return employee_schema.jsonify(employee), HTTPStatus.CREATED
    
    except ValidationError as ve:
        return jsonify({'message': 'Invalid input', 'error': ve.messages}), HTTPStatus.BAD_REQUEST

@employee_bp.get('/')
def get_all():
    employees = db.session.query(Employee).all()
    return jsonify(employees_schema.dump(employees)), HTTPStatus.OK