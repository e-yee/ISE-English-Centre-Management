from flask import Blueprint, request, jsonify
from models import student, db
from app.auth import role_required
import datetime

student_bp = Blueprint('student_bp', __name__, url_prefix='/student')

