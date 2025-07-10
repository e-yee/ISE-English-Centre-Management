from flask import Blueprint, request, jsonify
from models import staff_checkin, db, class_
import datetime
import re

checkin_bp = Blueprint('checkin_bp', __name__, url_prefix='/checkin')

@checkin_bp.route('/in', methods=['POST'])
def checkin():
    data = request.get_json()

    if not data or 'employee_id' not in data:
        return jsonify({'error': 'Invalid input'}), 400

    employee_id = data['employee_id']
    status = 'Not Checked In'
    time = datetime.datetime.now()

    employee = class_.Employee.query.filter_by(id=employee_id).first()
    if not employee:
        return jsonify({'error': 'Employee not found'}), 404

    if employee.role == 'Staff' or employee.role == 'Admin':
        required_time = datetime(9, 0 , 0)
        time = datetime.datetime.now().time()

        if time < datetime(9, 0 ,0) or time > datetime(20, 0, 0):
            return jsonify({'error': 'Check-in time must be between 9:00 AM and 8:00 PM'}), 400
        
        if time > required_time + datetime.timedelta(minutes=15):
            status = 'Late'

        else:
            status = 'Checked In'

    elif employee.role == 'Teacher':
        session = class_.Class.schedule.filter_by(teacher_id=employee_id).all()
        today_weekday = datetime.datetime.now().weekday()

        if not session:
            return jsonify({'error': 'No classes found for this teacher'}), 404
        
        weekday_map = {
            'Mon': 0,
            'Tue': 1,
            'Wed': 2,
            'Thu': 3,
            'Fri': 4,
            'Sat': 5,
            'Sun': 6
        }

        today_start_time = []

        for item in session:
            # Sample schedule format: "Mon - Wed, 09:00 - 10:30"
            matched = re.search(r"(\w{3}) - (\w{3}), (\d{1,2}:\d{2}) - (\d{1,2}:\d{2})", item.schedule)
            if matched:
                first_day_of_week = matched.group(1)
                second_day_of_week = matched.group(2)

                start_time = matched.group(3)
                end_time = matched.group(4)

                start = datetime.datetime.strptime(start_time, '%H:%M').time()
                end = datetime.datetime.strptime(end_time, '%H:%M').time()

                if weekday_map[first_day_of_week] == today_weekday or weekday_map[second_day_of_week] == today_weekday:
                    today_start_time.append(start)

        if not today_start_time:
            return jsonify({'error': 'No classes found for today'}), 404
        
        today_start_time.sort()
        first_class_start_time = today_start_time[0]

        if time <= first_class_start_time + datetime.timedelta(minutes=15):
            status = 'Late'
        elif time >= first_class_start_time:
            status = 'Checked In' 


    checkin_record = staff_checkin.StaffCheckin(
        employee_id=employee_id,
        status=status,
        checkin_time=time,
    )

    db.session.add(checkin_record)
    db.session.commit()

    return jsonify({'message': 'Check-in successful', 'checkin_id': checkin_record.id}), 201

@checkin_bp.route('/out', methods=['POST'])
def checkout():
    now = datetime.datetime.now()
    if now.time() < datetime.time(20, 15, 0):
        return jsonify({'error': 'Checkout is only allowed after 8:15 PM'}), 400

    staff_checkins = staff_checkin.StaffCheckin.query.filter(
        staff_checkin.StaffCheckin.status != 'Not Checked In',
        staff_checkin.StaffCheckin.checkin_time >= datetime.datetime.combine(now.date(), datetime.time(0, 0))
    ).all()

    for checkin_record in staff_checkins:
        checkin_record.status = 'Not Checked In'
        checkin_record.checkout_time = now

    db.session.commit()

    return jsonify({'message': f'Checked out {len(staff_checkins)} staff successfully.'}), 200