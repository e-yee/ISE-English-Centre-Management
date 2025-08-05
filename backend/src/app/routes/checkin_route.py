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
            
            today_weekday = datetime.datetime.now().weekday()
            weekday_map = {
                "Mon": 0,
                "Tue": 1,
                "Wed": 2,
                "Thu": 3,
                "Fri": 4,
                "Sat": 5,
                "Sun": 6
            }

            today_start_time = []
            for item in classes:
                # Sample schedule format: "Mon - Wed, 09:00 - 10:30"   
                # Please follow the following format
                matched = re.search(r"(\w{3}) - (\w{3}), (\d{2}:\d{2}) - (\d{2}:\d{2})", item.schedule)
                if matched:
                    first_day_of_week = matched.group(1)
                    second_day_of_week = matched.group(2)

                    start_time = matched.group(3)
                    start = datetime.datetime.strptime(start_time, "%H:%M").time()

                    if weekday_map[first_day_of_week] == today_weekday or \
                        weekday_map[second_day_of_week] == today_weekday:
                            today_start_time.append(start)

            if not today_start_time:
                return jsonify({"message": "No classes found for today"}), HTTPStatus.NOT_FOUND
            
            today_start_time.sort()
            first_class_start_time = today_start_time[0]

            if time >= first_class_start_time + datetime.timedelta(minutes=15):
                status = "Late"
            elif time <= first_class_start_time:
                status = "Checked In" 


        checkin_record = StaffCheckin(
            id=validated["id"],
            employee_id=validated["employee_id"],
            status=status,
            checkin_time=datetime.datetime.now(),
        )

        db.session.add(checkin_record)
        db.session.commit()

        return jsonify({"message": "Check-in successful", "checkin_id": checkin_record.id}), HTTPStatus.CREATED

    except ValidationError as ve:
        return jsonify({"message": "Invalid input", "error": ve.messages}), HTTPStatus.BAD_REQUEST

    except IntegrityError as ie:
        return jsonify({"message": "Database error", "error": str(ie.orig)}), HTTPStatus.INTERNAL_SERVER_ERROR

    except Exception as e:
        print(f"DEBUG: Actual error: {str(e)}")
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