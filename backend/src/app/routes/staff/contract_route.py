from flask import Blueprint
from app.auth import role_required
from app.models import Contract

contract_bp = Blueprint('contract_bp', __name__, url_prefix='/contract')

@role_required('Learning Advisor')
@contract_bp.route('/add', methods=['POST'])
def add_contract():
    pass 

@role_required('Learning Advisor')
@contract_bp.route('/remove', methods=['POST'])
def remove_contract():
    pass 