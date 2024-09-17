from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from fastapi.security import (
    OAuth2PasswordBearer,
    OAuth2PasswordRequestForm,
)
import os
from dotenv import load_dotenv
from jose import jwt, JWTError
from datetime import datetime, timedelta, timezone
from passlib.context import CryptContext

from database import get_db
from models.user import User, TokenBlacklist
from schemas.user import (
    UserOut,
    UserCreate,
    UserBase,
    ResponseUser,
    UserUpdate,
    UserInfo,
)
from typing import Optional
import uuid

load_dotenv()

router = APIRouter()


# --------------------------------------------------------------
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = 120
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


# --------------------------------------------------------------
# User CRUD
# --------------------------------------------------------------
# CREATE a new user
@router.post("/user", response_model=ResponseUser, tags=["User"])
async def create_user(user: UserCreate, db: Session = Depends(get_db)):
    hashed_password = pwd_context.hash(user.password)
    new_user = User(**user.model_dump(exclude={"password"}), password=hashed_password)
    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="このユーザー情報は既に存在します。",
        )
    except Exception:  # as e:
        db.rollback()
        raise HTTPException(
            status_code=500, detail="内部サーバーエラーが発生しました。"
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": new_user.email}, expires_delta=access_token_expires
    )
    # アクセストークンを含んだレスポンスを返す
    return {"user": new_user, "access_token": access_token, "token_type": "bearer"}


# --------------------------------------
# READ user
@router.get("/user/{user_id}", response_model=UserBase, tags=["User"])
async def get_user_by_userId(user_id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.user_id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user


# --------------------------------------
# UPDATE user
@router.put("/user/{user_id}", response_model=UserBase, tags=["User"])
async def update_user_by_userId(
    user_id: str, update_user: UserUpdate, db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    for key, value in update_user.model_dump().items():
        setattr(user, key, value) if value else None
    db.commit()
    db.refresh(user)
    return user


# --------------------------------------
# UPDATE user is_admin
@router.put("/admin/isadmin/user/{user_id}", response_model=UserBase, tags=["User"])
async def update_user_isadmin_by_userId(
    user_id: str,
    is_admin: bool,
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_admin = is_admin
    db.commit()
    db.refresh(user)
    return user


# --------------------------------------
# DELETE user
@router.delete("/user/{user_id}", tags=["User"])
async def delete_user(user_id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully"}


#  --------------------------------------------------------------
#  Authentication
#  --------------------------------------------------------------
# ユーザー情報を取得
def get_user(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()


# ユーザー認証
def authenticate_user(db: Session, username: str, password: str):
    user = get_user(db, username)
    if not user:
        return False
    if not pwd_context.verify(password, user.password):
        return False
    return user


# アクセストークンの作成
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire, "jti": str(uuid.uuid4())})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        jti = payload.get("jti")
        if db.query(TokenBlacklist).filter_by(jti=jti).first():
            # このトークンはブラックリストに含まれているため、認証を拒否
            raise credentials_exception
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        user = get_user(db, email)
        if user is None:
            raise credentials_exception
        return user
    except JWTError:
        raise credentials_exception


# 現在のアクティブユーザーを取得
async def get_current_active_user(current_user: UserInfo = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user


# トークンを取得するためのログイン
@router.post("/token", tags=["Authentication"])
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {
        "user_id": user.user_id,
        "access_token": access_token,
        "token_type": "bearer",
        "expires_at": datetime.now() + access_token_expires,
    }


# 自分自身のユーザー情報を取得
@router.get("/users/me/", response_model=UserBase, tags=["Authentication"])
async def read_users_me(current_user: UserInfo = Depends(get_current_active_user)):
    return current_user


# 自分自身のアイテムを取得
# @router.get("/users/me/items/")
# async def read_own_items(current_user: UserInfo = Depends(get_current_active_user)):
#     return [{"item_id": "Foo", "owner": current_user.email}]


# ログアウト
@router.post("/logout", tags=["Authentication"])
async def logout(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid token.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        jti = payload.get("jti")
        exp = payload.get("exp")
        if not jti:
            raise credentials_exception
        exp_datetime = datetime.fromtimestamp(exp)
        db.add(TokenBlacklist(jti=jti, exp=exp_datetime))
        db.commit()
    except JWTError:
        raise credentials_exception
    return {"message": "Logged out successfully"}


# --------------------------------------------------------------
# Adminstrator
# --------------------------------------------------------------
@router.get("/admin/users", response_model=list[UserOut], tags=["Administrator"])
async def admin_get_all_users(
    current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)
):
    users = db.query(User).all()
    return users


# @router.delete("/admin/user/{user_id}")
# async def admin_delete_user(
#     user_id: str,
#     current_user: User = Depends(get_admin_user),
#     db: Session = Depends(get_db),
# ):
#     user = db.query(User).filter(User.id == user_id).first()
#     if not user:
#         raise HTTPException(status_code=404, detail="User not found")
#     db.delete(user)
#     db.commit()
#     return {"message": "User deleted successfully"}
