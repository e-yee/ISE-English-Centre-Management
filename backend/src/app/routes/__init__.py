from teacher.attendance_route import attendance_bp
from teacher.evaluation_route import evaluation_bp
from staff.contract_route import contract_bp
from manager.dashboard_route import dashboard_bp
from .checkin_route import checkin_bp
from .homepage_route import homepage_bp
from auth.auth import auth_bp
from auth.logout import logout_bp
from flask import Blueprint

def register_blueprints(app):
    all_blueprints = [
        attendance_bp, 
        auth_bp, 
        contract_bp, 
        checkin_bp, 
        dashboard_bp, 
        evaluation_bp, 
        homepage_bp, 
        logout_bp
    ]
    
    for bp in all_blueprints:
        app.register_blueprint(bp)