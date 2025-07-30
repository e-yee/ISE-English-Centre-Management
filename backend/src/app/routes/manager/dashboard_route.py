from flask import Blueprint, request, jsonify
from app.auth import role_required
from ...http_status import HTTPStatus
from marshmallow import ValidationError
from sqlalchemy.exc import IntegrityError
dashboard_bp = Blueprint("dashboard_bp", __name__, url_prefix="/dashboard")

@dashboard_bp.route("/statistics", methods=["GET"])
@role_required("Manager")
def statistics():
    try:
        data = {}

        return jsonify(data), HTTPStatus.OK
    
    except ValidationError as ve:
        return jsonify({
            "message": "Invalid input", 
            "error": ve.messages
        }), HTTPStatus.BAD_REQUEST
    except IntegrityError as ie:
        return jsonify({
            "message": "Database error",
            "error": str(ie.orig)
        }), HTTPStatus.INTERNAL_SERVER_ERROR
    except Exception as e:
        return jsonify({
            "message": "Unexpected error occurred",
            "error": str(e)
        }), HTTPStatus.INTERNAL_SERVER_ERROR