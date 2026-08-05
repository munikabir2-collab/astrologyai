from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db

from app.services.payment_service import (
    REPORT_PRICES,
    create_payment_order,
    verify_payment,
)

router = APIRouter(
    prefix="/payment",
    tags=["Payment"],
)


# -----------------------------------------
# Request Models
# -----------------------------------------

class OrderRequest(BaseModel):
    report_type: str


class VerifyRequest(BaseModel):
    email: str
    report_type: str

    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str


# -----------------------------------------
# Create Razorpay Order
# -----------------------------------------

@router.post("/create-order")
def create_order(data: OrderRequest):

    order = create_payment_order(data.report_type)

    return {
        "success": True,
        **order,
    }


# -----------------------------------------
# Verify Razorpay Payment
# -----------------------------------------

@router.post("/verify")
def verify(
    data: VerifyRequest,
    db: Session = Depends(get_db),
):

    payment = verify_payment(
        db=db,
        email=data.email,
        report_type=data.report_type,
        razorpay_order_id=data.razorpay_order_id,
        razorpay_payment_id=data.razorpay_payment_id,
        razorpay_signature=data.razorpay_signature,
    )

    return {
        "success": True,
        "message": "Payment Successful",
        "payment_id": payment.payment_id,
        "report_type": payment.report_type,
        "status": payment.status,
    }


# -----------------------------------------
# Price List
# -----------------------------------------

@router.get("/prices")
def prices():

    return {
        "success": True,
        "prices": REPORT_PRICES,
    }