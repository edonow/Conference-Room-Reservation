from pydantic import BaseModel
from datetime import date, datetime


class ReservedInfo(BaseModel):
    reserved_id: str
    room: str
    date: date
    start: int
    end: int
    number: int
    price: int
    user_id: str
    booked_at: datetime


class ReservedCreate(BaseModel):
    room: str
    date: date
    start: int
    end: int
    number: int
    price: int
    user_id: str


class ReservedOut(BaseModel):
    reserved_id: str
    room: str
    date: date
    start: int
    end: int
    number: int
    price: int
    booked_at: datetime
