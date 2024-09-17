import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()

DB_URL = f'mysql+pymysql://{os.getenv("MYSQL_USER")}:{os.getenv("MYSQL_PASSWORD")}@{os.getenv("MYSQL_HOST")}/{os.getenv("MYSQL_DATABASE")}'
engine = create_engine(DB_URL)
sessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    db = sessionLocal()
    try:
        yield db
    finally:
        db.close()
