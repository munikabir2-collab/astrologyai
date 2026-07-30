import os

import razorpay
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User

load_dotenv()

router = APIRouter(
    prefix="/payment",
    tags=["Payment"],
)

client = razorpay.Client(
    auth=(
        os.getenv("RAZORPAY_KEY_ID"),
        os.getenv("RAZORPAY_KEY_SECRET"),
    )
)


class VerifyRequest(BaseModel):
    email: str
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str


@router.post("/create-order")
def create_order():

    order = client.order.create(
        {
            "amount": 49900,          # ₹499 Test
            "currency": "INR",
            "payment_capture": 1,
        }
    )

    return {
        "success": True,
        "key": os.getenv("RAZORPAY_KEY_ID"),
        "order": order,
    }


@router.post("/verify")
def verify_payment(
    data: VerifyRequest,
    db: Session = Depends(get_db),
):

    try:

        client.utility.verify_payment_signature(
            {
                "razorpay_order_id": data.razorpay_order_id,
                "razorpay_payment_id": data.razorpay_payment_id,
                "razorpay_signature": data.razorpay_signature,
            }
        )

        # Find User
        user = (
            db.query(User)
            .filter(User.email == data.email)
            .first()
        )

        if not user:
            raise HTTPException(
                status_code=404,
                detail="User not found",
            )

        # Activate Subscription
        user.subscription_plan = "PRO"
        user.subscription_active = True

        db.commit()
        db.refresh(user)

        return {
            "success": True,
            "message": "Subscription Activated",
            "plan": "PRO",
        }

    except HTTPException:
        raise

    except Exception as e:
        print(e)

        raise HTTPException(
            status_code=400,
            detail="Payment Verification Failed",
        )