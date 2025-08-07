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
def generate_room_id():
    last_room = db.session.query(Room).order_by(Room.id.desc()).first()
    
    if not last_room:
        return "ROOM001"
    else:
        prefix = last_room.id[:4]
        room_number = int(last_room.id[4:]) + 1
        
        return f"{prefix}{room_number:03}"

def get_room_id():
    room_id = request.args.get("id")
    if not room_id:
        return None, jsonify({
            "message": "Missing room ID in query params"
        }), HTTPStatus.BAD_REQUEST
    
    return room_id, None, None

def validate_room(room_id):
    room = db.session.get(Room, room_id)
    
    if not room:
        return None, jsonify({
            "message": "Room not found"
        }), HTTPStatus.NOT_FOUND
    
    return room, None, None

# Manager Features
@room_bp.post("/manager/add")
@role_required("Manager")
def manager_create_room():
    try:
        if not request.is_json:
            return jsonify({
                "message": "Missing or invalid JSON"
            }), HTTPStatus.BAD_REQUEST
        
        request_data = request.get_json()
        validated_data = room_schema.load(request_data)
        
        room = Room(
            id=generate_room_id(),
            name=validated_data["name"]
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
        
@room_bp.get("/manager/")
@role_required("Manager")
def manager_get_rooms():
    try:
        room_list = db.session.query(Room).all()
        return jsonify(room_schema.dump(room_list, many=True)), HTTPStatus.OK
    
    except Exception as e:
        return jsonify({
            "message": "Unexpected error occurred",
            "error": str(e)
        }), HTTPStatus.INTERNAL_SERVER_ERROR

@room_bp.get("/manager/search")
@role_required("Manager")
def manager_get_room():
    try:
        room_id, error_response, status_code = get_room_id()
        if not room_id:
            return error_response, status_code

        room, error_response, status_code = validate_room(room_id)
        if not room:
            return error_response, status_code
        
        return jsonify(room_schema.dump(room)), HTTPStatus.OK
    
    except Exception as e:
        return jsonify({
            "message": "Unexpected error occurred"
        }), HTTPStatus.INTERNAL_SERVER_ERROR

@room_bp.get("/manager/update")
@role_required("Manager")
def manager_update_room():
    try:
        room_id, error_response, status_code = get_room_id()
        if not room_id:
            return error_response, status_code
        
        room, error_response, status_code = validate_room(room_id)
        if not room:
            return error_response, status_code
        
        if not request.is_json:
            return jsonify({
                "message": "Missing or invalid JSON"
            }), HTTPStatus.BAD_REQUEST
        
        request_data = request.get_json()
        update_fields = room_schema.load(request_data, partial=True)
        
        for key, value in update_fields.items():
            setattr(room, key, value)
            
        db.session.commit()
        return jsonify({
            "message": "Room updated successfully"
        }), HTTPStatus.OK
    
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
    
@room_bp.delete("/manager/delete")
@role_required("Manager")
def manager_delete_room():
    try:
        room_id, error_response, status_code = get_room_id()
        if not room_id:
            return error_response, status_code

        room, error_response, status_code = validate_room(room_id)
        if not room:
            return error_response, status_code
        
        db.session.delete(room)
        db.session.commit

        return jsonify({
            "message": "Room deleted successfully"
        }), HTTPStatus.OK
    
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