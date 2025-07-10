from flask import Blueprint
from app.auth import role_required

evaluation_bp = Blueprint('evaluation_bp', __name__, url_prefix='/evaluation')

@role_required('Teacher')
@evaluation_bp.route('/add', methods=['POST'])
def add_evaluation():
    pass

@role_required('Teacher', 'Learning Advisor')
@evaluation_bp.route('/view', methods=['GET'])
def view_evaluation():
    pass