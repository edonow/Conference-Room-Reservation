from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

from database import get_db
from models.reserved import Reserved
from schemas.reserved import ReservedInfo, ReservedCreate, ReservedOut

from models.user import User
from routers.user import get_current_active_user


router = APIRouter()


# --------------------------------------------------------------
# Reservation CRUD
# --------------------------------------------------------------
# READ reservation by user_id
@router.get(
    "/reserved/user/{user_id}", response_model=list[ReservedOut], tags=["Reservation"]
)
async def get_user_reserved_by_userId(user_id: str, db: Session = Depends(get_db)):
    reserved = db.query(Reserved).filter(Reserved.user_id == user_id).all()
    if not reserved:
        return []
        # raise HTTPException(status_code=404, detail="Reserved not found")
    return reserved


# ------------------------------
# READ reservation by date
@router.get(
    "/reserved/date/{date}", response_model=list[ReservedOut], tags=["Reservation"]
)
async def get_reserved_date(date: str, db: Session = Depends(get_db)):
    reserved = db.query(Reserved).filter(Reserved.date == date).all()
    if not reserved:
        return []
    return reserved


# ------------------------------
# CREATE reservation
@router.post("/reserved", response_model=ReservedInfo, tags=["Reservation"])
async def create_reserved(
    reserved_create: ReservedCreate, db: Session = Depends(get_db)
):
    new_reserved = Reserved(**reserved_create.dict())
    db.add(new_reserved)
    db.commit()
    return new_reserved


# ------------------------------
# DELETE reserved by reserved_id
@router.delete("/reserved/{reserved_id}", tags=["Reservation"])
async def delete_reserved(reserved_id: str, db: Session = Depends(get_db)):
    reserved = db.query(Reserved).filter(Reserved.reserved_id == reserved_id).first()
    if reserved is None:
        raise HTTPException(status_code=404, detail="Reserved not found")
    db.delete(reserved)
    db.commit()
    return {"message": "Reserved deleted successfully"}


# ------------------------------
# DELETE reserved by user_id
@router.delete("/reserved/user/{user_id}", tags=["Reservation"])
async def delete_all_future_reservations_for_user(
    user_id: str,
    db: Session = Depends(get_db),
):
    now = datetime.now()
    reservations = (
        db.query(Reserved)
        .filter(Reserved.user_id == user_id, Reserved.date > now)
        .all()
    )
    if not reservations:
        raise HTTPException(
            status_code=202, detail="No future reservations found for this user"
        )
    for reservation in reservations:
        db.delete(reservation)
    db.commit()
    return {"message": "All future reservations for the user deleted successfully"}


# --------------------------------------------------------------
# Administrator
# --------------------------------------------------------------
@router.get(
    "/admin/reservations", response_model=list[ReservedInfo], tags=["Administrator"]
)
async def admin_get_all_reservation(
    current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)
):
    reserved = db.query(Reserved).all()
    return reserved
