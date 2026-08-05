import os
from datetime import datetime

import razorpay
from dotenv import load_dotenv
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.payment import Payment
from app.models.user import User

load_dotenv()

client = razorpay.Client(
    auth=(
        os.getenv("RAZORPAY_KEY_ID"),
        os.getenv("RAZORPAY_KEY_SECRET"),
    )
)

REPORT_PRICES = {
    "gemini": 49,
    "horoscope": 1,
    "kundli": 1,
    "birth_chart": 79,
    "compatibility": 149,
    "panchang": 0,
    "dasha": 99,
    "transit": 79,
    "numerology": 49,
    "palm": 99,
    "face": 99,
    "scanner": 49,
    "voice": 99,
    "ai_report": 199,
    "muhurat": 49,
}


def create_payment_order(report_type: str):

    if report_type not in REPORT_PRICES:
        raise HTTPException(
            status_code=400,
            detail="Invalid report type",
        )

    amount = REPORT_PRICES[report_type]

    if amount == 0:
        return {
            "free": True,
            "amount": 0,
        }

    order = client.order.create(
        {
            "amount": amount * 100,
            "currency": "INR",
            "payment_capture": 1,
            "notes": {
                "report": report_type,
            },
        }
    )

    return {
        "free": False,
        "key": os.getenv("RAZORPAY_KEY_ID"),
        "amount": amount,
        "order": order,
    }


def verify_payment(
    db: Session,
    email: str,
    report_type: str,
    razorpay_order_id: str,
    razorpay_payment_id: str,
    razorpay_signature: str,
):

    client.utility.verify_payment_signature(
        {
            "razorpay_order_id": razorpay_order_id,
            "razorpay_payment_id": razorpay_payment_id,
            "razorpay_signature": razorpay_signature,
        }
    )

    user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    payment = Payment(
        user_id=user.id,
        report_type=report_type,
        amount=REPORT_PRICES[report_type],
        currency="INR",
        payment_gateway="razorpay",
        order_id=razorpay_order_id,
        payment_id=razorpay_payment_id,
        signature=razorpay_signature,
        status="PAID",
        payment_date=datetime.utcnow(),
    )

    db.add(payment)
    db.commit()
    db.refresh(payment)

    return payment


def has_paid_report(
    db: Session,
    user_id: int,
    report_type: str,
):

    payment = (
        db.query(Payment)
        .filter(
            Payment.user_id == user_id,
            Payment.report_type == report_type,
            Payment.status == "PAID",
        )
        .first()
    )

    return payment is not None


def get_user_payments(
    db: Session,
    user_id: int,
):

    return (
        db.query(Payment)
        .filter(
            Payment.user_id == user_id
        )
        .order_by(Payment.created_at.desc())
        .all()
    )

def has_access(
    db: Session,
    email: str,
    report_type: str,
):
    user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    

    if not user:
        return False

    payment = (
        db.query(Payment)
        .filter(
            Payment.user_id == user.id,
            Payment.report_type == report_type,
            Payment.status == "PAID",
        )
        .first()
    )

    print("PAYMENT:", payment)

    return payment is not None


from fastapi import HTTPException


def verify_feature_payment(
    db: Session,
    email: str,
    feature: str,
):
    """
    Verify that the user has already paid
    for the requested feature.
    """

    if not has_access(db, email, feature):
        raise HTTPException(
            status_code=403,
            detail=f"Please pay ₹{REPORT_PRICES.get(feature, 99)} to unlock this feature."
        )

    return True
