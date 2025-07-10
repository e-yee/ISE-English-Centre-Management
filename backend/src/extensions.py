from flask_marshmallow import Marshmallow
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from app.models import Base
from flask_cors import CORS
from passlib.context import CryptContext

ma = Marshmallow()

jwt = JWTManager()

migrate = Migrate()

db = SQLAlchemy(model_class=Base)

cors = CORS()

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")