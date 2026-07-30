from pydantic import BaseModel
from datetime import date, time
from typing import Optional


class ProfileCreate(BaseModel):
    full_name: str
    phone: Optional[str] = None
    gender: Optional[str] = None
    dob: Optional[date] = None
    birth_time: Optional[time] = None
    birth_place: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    gender: Optional[str] = None
    dob: Optional[date] = None
    birth_time: Optional[time] = None
    birth_place: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class ProfileResponse(BaseModel):
    id: int
    user_id: int
    full_name: str
    phone: Optional[str]
    gender: Optional[str]
    dob: Optional[date]
    birth_time: Optional[time]
    birth_place: Optional[str]
    latitude: Optional[float]
    longitude: Optional[float]

    class Config:
        from_attributes = True