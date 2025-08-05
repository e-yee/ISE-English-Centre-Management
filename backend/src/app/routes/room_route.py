from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from sqlalchemy.exc import IntegrityError, OperationalError
from extensions import db
from ..auth import role_required
from ..models import Room
from ..schemas.room_schema import room_schema
from ..http_status import HTTPStatus

room_bp = Blueprint("room_bp", __name__, url_prefix="/room")

# Helper Functions
def generate_id():
    last_room = db.session.query(Room).order_by(Room.id.desc()).first()
    
    if not last_room:
        return "ROOM001"
    else:
        prefix = last_room.id[:4]
        num = int(last_room.id[4:]) + 1
        
        return f"{prefix}{num:03}"
    
# Manager Features
@room_bp.post("/manager/add")
@role_required("Manager")
def manager_add_room():
    try:
        if not request.is_json:
            return jsonify({
                "message": "Missing or invalid JSON"
            }), HTTPStatus.BAD_REQUEST
        
        json_data = request.get_json()
        validated = room_schema.load(json_data)
        
        room = Room(
            id=generate_id(),
            name=validated["name"]
        )
        
        db.session.add(room)
        db.session.commit()
        
        return jsonify(room_schema.dump(room)), HTTPStatus.CREATED

    except ValidationError as ve:
        return jsonify({
            "message": "Invalid input",
            "error": ve.messages
        }), HTTPStatus.BAD_REQUEST
    
    except IntegrityError as ie:
        db.session.rollback()
        return jsonify({
            "message": "Violate database constraint",
            "error": str(ie.orig)
        }), HTTPStatus.BAD_REQUEST
        
    except OperationalError as oe:
        db.session.rollback()
        return jsonify({
            "message": "Violate database constraint",
            "error": str(oe.orig)
        }), HTTPStatus.BAD_REQUEST
    
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "message": "Unexpected error occurred",
            "error": str(e)
        }), HTTPStatus.INTERNAL_SERVER_ERROR       