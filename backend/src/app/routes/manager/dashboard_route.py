from flask import Blueprint, request, jsonify
from app.auth import role_required
from ...http_status import HTTPStatus
from marshmallow import ValidationError
from sqlalchemy.exc import IntegrityError
from ...models import Employee, Contract, Course
from extensions import db
from sqlalchemy import func
from flask_jwt_extended import get_jwt_identity
import datetime

dashboard_bp = Blueprint("dashboard_bp", __name__, url_prefix="/dashboard")

@dashboard_bp.get("/statistics")
@role_required("Manager")
def overview_statistics():
    pass

@dashboard_bp.get("/statistics/students")
@role_required("Manager")
def student_statistics():
    pass

@dashboard_bp.get("/statistics/teachers")
@role_required("Manager")
def teacher_statistics():
    pass

@dashboard_bp.get("/statistics/revenue")
@role_required("Manager")
def revenue_statistics():
    pass