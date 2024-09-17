import os
import secrets
import string
from sqlalchemy import Column, String, DateTime, func, Boolean, Integer
from dotenv import load_dotenv


from base import Base

load_dotenv()


def generate_random_id():
    return "".join(
        secrets.choice(string.ascii_letters + string.digits) for _ in range(10)
    )


class User(Base):
    __tablename__ = os.getenv("USER_TABLE_NAME")
    user_id: str = Column(String(10), primary_key=True, default=generate_random_id)
    firstName: str = Column(String(100), nullable=False)
    lastName: str = Column(String(100), nullable=False)
    organization: str = Column(String(100), nullable=True)
    email: str = Column(String(100), unique=True, nullable=False)
    password: str = Column(String(100), nullable=False)
    is_admin: bool = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )


class TokenBlacklist(Base):
    __tablename__ = "token_blacklist"
    id = Column(Integer, primary_key=True, index=True)
    jti = Column(String(255), unique=True, index=True)
    exp = Column(DateTime)
