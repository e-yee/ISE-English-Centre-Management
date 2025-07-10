from flask import Blueprint
from app.auth import role_required

dashboard_bp = Blueprint('dashboard_bp', __name__, url_prefix='/dashboard')

@role_required('Manager')
@dashboard_bp.route('/statistics', methods=['GET'])
def statistics():
    pass