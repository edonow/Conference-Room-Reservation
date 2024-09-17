from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class UserOut(BaseModel):
    user_id: str
    firstName: str
    lastName: str
    organization: str
    email: str
    is_admin: bool
    created_at: datetime
    updated_at: datetime


class UserCreate(BaseModel):
    firstName: str
    lastName: str
    organization: str
    email: str
    password: str


class UserUpdate(BaseModel):
    firstName: str
    lastName: str
    organization: str
    email: str


class UserBase(BaseModel):
    user_id: str
    firstName: str
    lastName: str
    organization: str
    email: str
    is_admin: bool


class ResponseUser(BaseModel):
    user: UserBase
    access_token: str
    token_type: str


# ----------------------------
# AUTHENTICATION SCHEMAS
# ----------------------------
class UserInfo(BaseModel):
    user_id: str
    firstName: str
    lastName: str
    organization: str
    email: str
    is_admin: bool
    password: Optional[str] = None
