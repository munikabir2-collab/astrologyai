from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.services.compatibility_service import calculate_compatibility
from app.services.payment_service import verify_feature_payment

router = APIRouter(
    prefix="/astrology",
    tags=["Astrology"]
)


class CompatibilityRequest(BaseModel):
    email: str

    boy_name: str
    boy_birth_date: str
    boy_birth_time: str
    boy_birth_place: str

    girl_name: str
    girl_birth_date: str
    girl_birth_time: str
    girl_birth_place: str


@router.post("/compatibility")
def compatibility(
    request: CompatibilityRequest,
    db: Session = Depends(get_db),
):

    # ₹99 Payment Check
    verify_feature_payment(
        db=db,
        email=request.email,
        feature="compatibility"
    )

    # Generate Compatibility Report
    return calculate_compatibility(
        boy_name=request.boy_name,
        boy_birth_date=request.boy_birth_date,
        boy_birth_time=request.boy_birth_time,
        boy_birth_place=request.boy_birth_place,

        girl_name=request.girl_name,
        girl_birth_date=request.girl_birth_date,
        girl_birth_time=request.girl_birth_time,
        girl_birth_place=request.girl_birth_place,
    )