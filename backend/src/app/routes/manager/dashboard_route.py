from flask import Blueprint
from app.auth import role_required

dashboard_bp = Blueprint('dashboard_bp', __name__, url_prefix='/dashboard')

@dashboard_bp.route('/statistics', methods=['GET'])
@role_required('Manager')
def statistics():
    pass