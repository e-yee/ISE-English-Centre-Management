from flask import Flask
from extensions import db, jwt, ma, cors
from app.routes import register_blueprints
from config import Config

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    jwt.init_app(app)
    ma.init_app(app)
    cors.init_app(
        app,
        resources={r"/*": {"origin": "http://localhost:5000"}},
        supports_credentials=True
    )

    register_blueprints(app)
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)