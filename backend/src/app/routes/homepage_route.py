from flask import Blueprint

homepage_bp = Blueprint('homepage_bp', __name__, url_prefix='/homepage')

@homepage_bp.route('/', methods=['GET'])
def homepage():
    pass