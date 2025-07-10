from flask import Blueprint
from app.auth import role_required

attendance_bp = Blueprint('attendance_bp', __name__, url_prefix='/attendance')

@role_required('Teacher')
@attendance_bp.route('/mark', methods=['POST'])
def mark_attendance():
    pass

@role_required('Teacher', 'Leaning Advisor')
@attendance_bp.route('/view', methods=['GET'])
def view_attendance():
    pass 