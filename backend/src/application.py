from flask import Flask
from extensions import db, jwt, ma
from app.routes import register_blueprints
from config import Config

my_app = Flask(__name__)
my_app.config.from_object(Config)

db.init_app(my_app)
jwt.init_app(my_app)
ma.init_app(my_app)

register_blueprints(my_app)

if __name__ == '__main__':
    my_app.run()