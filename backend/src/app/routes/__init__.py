from .teacher.attendance_route import attendance_bp
from .teacher.evaluation_route import evaluation_bp
from .teacher.leave_request_route import leave_request_bp
from .contract_route import contract_bp
from .course_route import course_bp
from .student_route import student_bp
from .student_attendance_route import student_attendance_bp
from .class_route import class_bp
from .room_route import room_bp
from .manager.dashboard_route import dashboard_bp
from .checkin_route import checkin_bp
from .homepage_route import homepage_bp
from ..auth.auth import auth_bp
from .account_route import account_bp
from .employee_route import employee_bp
from .teacher.issue_route import issue_bp
from .teacher.leave_request_route import leave_request_bp
from .manager.dashboard_route import dashboard_bp

def register_blueprints(app):
    all_blueprints = [
        attendance_bp, 
        auth_bp, 
        account_bp,
        contract_bp, 
        course_bp,
        class_bp,
        student_attendance_bp,
        checkin_bp, 
        dashboard_bp, 
        evaluation_bp,
        employee_bp, 
        homepage_bp,
        student_bp,
        issue_bp,
        room_bp,
        leave_request_bp
    ]
    
    for bp in all_blueprints:
        app.register_blueprint(bp)