from application import my_app
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

engine = create_engine(my_app["SQL_ALCHEMY_DATABASE_URL"])
SessionLocal = sessionmaker(bind=engine)