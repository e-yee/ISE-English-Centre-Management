from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from extensions import jwt, db
from app.models import TokenBlocklist

logout_bp = Blueprint('logout_bp', __name__)

@logout_bp.route("/logout", methods=["DELETE"])
@jwt_required()
def logout():
    jti = get_jwt()["jti"]
    db.session.add(TokenBlocklist(jti=jti))
    db.session.commit()
    return jsonify({"message": "Successfully logged out!"}), 200


@jwt.token_in_blocklist_loader
def check_token_in_blocklist(jwt_header, jwt_payload):
    jti = jwt_payload["jti"]
    return db.session.query(TokenBlocklist).filter_by(jti=jti).scalar() is not None
