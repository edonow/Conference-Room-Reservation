from fastapi import FastAPI
from database import engine, sessionLocal
from sqlalchemy import delete
from datetime import datetime, timedelta
from base import Base
from models.user import User, TokenBlacklist
from routers import user, reserved
import os
from dotenv import load_dotenv

from routers.user import pwd_context

load_dotenv()

app = FastAPI()
app.include_router(user.router)
app.include_router(reserved.router)


def reset_db():
    # Delete tables
    Base.metadata.drop_all(bind=engine)
    # Create tables
    Base.metadata.create_all(bind=engine)

    # Create a default admin user
    db = sessionLocal()
    admin_user = User(
        firstName=os.getenv("ADMIN_FIRST_NAME"),
        lastName=os.getenv("ADMIN_LAST_NAME"),
        organization=os.getenv("ADMIN_ORGANIZATION"),
        email=os.getenv("ADMIN_EMAIL"),
        password=pwd_context.hash(os.getenv("ADMIN_PASSWORD")),
        is_admin=True,
    )
    db.add(admin_user)
    db.commit()


def reset_token_blacklist():
    db = sessionLocal()
    one_month_ago = datetime.now() - timedelta(days=30)
    stmt = delete(TokenBlacklist).where(TokenBlacklist.exp < one_month_ago)
    db.execute(stmt)
    db.commit()


# reset_db()
reset_token_blacklist()
print("Database reset")
