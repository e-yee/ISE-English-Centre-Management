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
    

@checkin_bp.post("/in")
def checkin():
    if not request.is_json:
        return jsonify({"message": "Missing or invalid JSON"}), HTTPStatus.BAD_REQUEST
     
    try:
        data = request.get_json()
        validated = checkin_schema.load(data)

        employee = db.session.get(Employee, validated["employee_id"])
        if not employee:
            return jsonify({"message": "Employee not found"}), HTTPStatus.NOT_FOUND

        if employee.role == "Learning Advisor" or employee.role == "Manager":
            required_time = datetime.time(9, 0, 0)
            leave_time = datetime.time(20, 0, 0)
            time = datetime.datetime.now().time()

            if time < required_time or time > leave_time:
                return jsonify({"message": "Check-in time must be between 9:00 AM and 8:00 PM"}), HTTPStatus.BAD_REQUEST
            
            # Convert to datetime for timedelta comparison
            today = datetime.datetime.now().date()
            required_datetime = datetime.datetime.combine(today, required_time)
            current_datetime = datetime.datetime.combine(today, time)
            
            if current_datetime > required_datetime + datetime.timedelta(minutes=15):
                status = "Late"    
            else:
                status = "Checked In"           
        elif employee.role == "Teacher":
            classes = db.session.query(Class).filter_by(teacher_id=validated["employee_id"]).all()
            if not classes:
                return jsonify({"message": "No classes found for this teacher"}), HTTPStatus.NOT_FOUND
            
            # Get today's date
            today = datetime.datetime.now().date()
            current_time = datetime.datetime.now().time()

            # Find classes for today
            today_classes = []
            for item in classes:
                # Check if class is today
                if item.class_date.date() == today:
                    today_classes.append(item)

            if not today_classes:
                return jsonify({"message": "No classes found for today"}), HTTPStatus.NOT_FOUND
            
            # Sort classes by start time
            today_classes.sort(key=lambda x: x.class_date.time())
            first_class = today_classes[0]
            first_class_start_time = first_class.class_date.time()

            if time >= first_class_start_time + datetime.timedelta(minutes=15):
                status = "Late"
            elif time <= first_class_start_time:
                status = "Checked In"
            else:
                status = "Checked In"


        checkin_record = StaffCheckin(
            id=generate_id(),
            employee_id=validated["employee_id"],
            status=status,
            checkin_time=datetime.datetime.now(),
        )

        db.session.add(checkin_record)
        db.session.commit()

        return jsonify(checkin_schema.dump(checkin_record, many=False)), HTTPStatus.CREATED

    except ValidationError as ve:
        return jsonify({"message": "Invalid input", "error": ve.messages}), HTTPStatus.BAD_REQUEST

    except IntegrityError as ie:
        return jsonify({"message": "Database error", "error": str(ie.orig)}), HTTPStatus.INTERNAL_SERVER_ERROR

    except Exception as e:
        return jsonify({"message": "Unexpected error occured", "error": str(e)}), HTTPStatus.INTERNAL_SERVER_ERROR

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