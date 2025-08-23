from flask_marshmallow import Marshmallow
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase
from flask_cors import CORS
from flask_mail import Mail
from passlib.context import CryptContext

ma = Marshmallow()

jwt = JWTManager()

migrate = Migrate()

class Base(DeclarativeBase): pass
db = SQLAlchemy(model_class=Base)

cors = CORS()

mail = Mail()

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")