from flask import Flask
from extensions import db, jwt, ma
from app.routes import register_blueprint
from config import Config

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    jwt.init_app(app)
    ma.init_app(app)

    register_blueprint(app)

    return app 