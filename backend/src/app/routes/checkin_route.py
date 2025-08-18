from flask import Blueprint, request, jsonify
from ..models import StaffCheckin, Class, Employee
from ..http_status import HTTPStatus
from ..schemas.checkin_schema import checkin_schema
from extensions import db
import datetime
import re
from marshmallow import ValidationError
from sqlalchemy.exc import IntegrityError

checkin_bp = Blueprint("checkin_bp", __name__, url_prefix="/checkin")

def generate_id():
    last_id = db.session.query(StaffCheckin).order_by(StaffCheckin.id.desc()).first()

    if not last_id:
        return "CK001"
    
    else:
        prefix = last_id.id[:2]
        last_number = int(last_id.id[2:]) + 1
        return f"{prefix}{last_number:03}"

def validate_id(id):
    employee = db.session.query(Employee).filter_by(id=id).first()
    if not employee:
        return None, jsonify({
            "message": "Employee not found"
        }), HTTPStatus.NOT_FOUND
    
    return employee, None, None

@checkin_bp.post("/in")
def checkin():
    if not request.is_json:
        return jsonify({"message": "Missing or invalid JSON"}), HTTPStatus.BAD_REQUEST
    
    try:
        data = request.get_json()
        validated = checkin_schema.load(data)

        employee, response, status = validate_id(validated["employee_id"])
        if not employee:
            return response, status
        
        current_datetime = datetime.datetime.now()
        today = current_datetime.date()
        status = "Checked In" 

        if employee.role in ["Learning Advisor", "Manager"]:
            required_time = datetime.time(9, 0, 0)
            leave_time = datetime.time(20, 0, 0)

            if not (required_time <= current_datetime.time() <= leave_time):
                return jsonify({"message": "Check-in time must be between 9:00 AM and 8:00 PM"}), HTTPStatus.BAD_REQUEST
            
            required_datetime = datetime.datetime.combine(today, required_time)

            if current_datetime > required_datetime + datetime.timedelta(minutes=15):
                status = "Late"
        
        elif employee.role == "Teacher":
            from sqlalchemy import func
            today_classes = db.session.query(Class).filter(
                Class.teacher_id == employee.id,
                func.date(Class.class_date) == today
            ).order_by(Class.class_date).all()
            
            if not today_classes:
                return jsonify({"message": "No classes scheduled for you today"}), HTTPStatus.NOT_FOUND
            
            first_class = today_classes[0]
            first_class_start_datetime = first_class.class_date 

            if current_datetime > first_class_start_datetime + datetime.timedelta(minutes=15):
                status = "Late"

        # --- Create the record ---
        checkin_record = StaffCheckin(
            id=generate_id(),
            employee_id=employee.id,
            status=status,
            checkin_time=current_datetime,
        )

        db.session.add(checkin_record)
        db.session.commit()

        return jsonify(checkin_schema.dump(checkin_record)), HTTPStatus.CREATED

    except ValidationError as ve:
        return jsonify({"message": "Invalid input", "error": ve.messages}), HTTPStatus.BAD_REQUEST
    except IntegrityError as ie:
        db.session.rollback()
        return jsonify({"message": "Database error", "error": str(ie.orig)}), HTTPStatus.INTERNAL_SERVER_ERROR
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "An unexpected error occurred", "error": str(e)}), HTTPStatus.INTERNAL_SERVER_ERROR

@checkin_bp.put("/out")
def checkout():
    now = datetime.datetime.now()
    if now.time() < datetime.time(20, 15, 0):
        return jsonify({"message": "Checkout is only allowed after 8:15 PM"}), HTTPStatus.BAD_REQUEST

    staff_checkins = db.session.query(StaffCheckin).filter(
        StaffCheckin.status != "Not Checked In",
        StaffCheckin.checkin_time >= datetime.datetime.combine(now.date(), datetime.time(0, 0))
    ).all()

    for checkin_record in staff_checkins:
        checkin_record.status = "Not Checked In"
        checkin_record.checkout_time = now

    db.session.commit()

    return jsonify({"message": f"Checked out {len(staff_checkins)} staff successfully."}), HTTPStatus.OK

@checkin_bp.get("/status")
def view_stats():
    try:
        # Accept either query param or JSON body for flexibility
        id = request.args.get("id")
        if not id and request.is_json:
            data = request.get_json()
            id = data.get("id") if isinstance(data, dict) else None
        employee, response, status = validate_id(id)
        if not employee:
            return response, status
        
        checkin_records = db.session.query(StaffCheckin).filter_by(employee_id=employee.id).all()

        return jsonify(checkin_schema.dump(checkin_records, many=True)), HTTPStatus.OK

    except Exception as e:
        return jsonify({"message": "Unexpected error occurred", "error": str(e)}), HTTPStatus.INTERNAL_SERVER_ERROR

