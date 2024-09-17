import os
from sqlalchemy import Column, String, DateTime, func, Integer, Date
from dotenv import load_dotenv

from base import Base
from models.user import generate_random_id

load_dotenv()

table_name = os.getenv("USER_TABLE_NAME")


class Reserved(Base):
    __tablename__ = os.getenv("RESERVED_TABLE_NAME")
    reserved_id: str = Column(String(10), primary_key=True, default=generate_random_id)
    room: str = Column(String(100), nullable=False)
    date = Column(Date, nullable=False)
    start: int = Column(Integer, nullable=False)
    end: int = Column(Integer, nullable=False)
    number: int = Column(Integer, nullable=False)
    price: int = Column(Integer, nullable=False)
    user_id: str = Column(String(10))
    booked_at = Column(DateTime(timezone=True), server_default=func.now())
