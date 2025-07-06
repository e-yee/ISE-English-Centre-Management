from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from extensions import jwt

blocklist = set() # cai nay phai load blocklist tu database, nghia la trong database phai co 1 cai bang goi la blocklist, roi moi lan logout la query

logout_bp = Blueprint('logout_bp', __name__)

@logout_bp.route("/logout", methods=["DELETE"])
@jwt_required
def logout():
    jti = get_jwt()["jti"]
    blocklist.add(jti)
    return jsonify({"message": "Successfully logged out!"}), 200


@jwt.token_in_blocklist_loader
def check_token_in_blocklist(jwt_header, jwt_payload):
    jti = jwt_payload["jti"]
    return jti in blocklist
