import os
from datetime import datetime, timezone

import razorpay
from dotenv import load_dotenv
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.payment import Payment
from app.models.user import User

load_dotenv()


# ==========================================================
# Razorpay Configuration
# ==========================================================

RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET")


if not RAZORPAY_KEY_ID:
    raise RuntimeError("RAZORPAY_KEY_ID is not configured")

if not RAZORPAY_KEY_SECRET:
    raise RuntimeError("RAZORPAY_KEY_SECRET is not configured")


client = razorpay.Client(
    auth=(
        RAZORPAY_KEY_ID,
        RAZORPAY_KEY_SECRET,
    )
)


# ==========================================================
# Report Prices
# ==========================================================

REPORT_PRICES = {
    "gemini": 49,
    "horoscope": 499,
    "kundli": 499,
    "birth_chart": 79,
    "compatibility": 149,
    "panchang": 0,
    "dasha": 499,
    "transit": 79,
    "numerology": 49,
    "palm": 99,
    "face": 99,
    "scanner": 49,
    "voice": 99,
    "ai_report": 199,
    "muhurat": 49,
}


# ==========================================================
# Create Razorpay Order
# ==========================================================

def create_payment_order(report_type: str):

    if report_type not in REPORT_PRICES:
        raise HTTPException(
            status_code=400,
            detail="Invalid report type",
        )

    amount = REPORT_PRICES[report_type]

    # Free feature
    if amount == 0:
        return {
            "free": True,
            "amount": 0,
            "report_type": report_type,
        }

    try:

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

    except Exception as e:

        print("RAZORPAY ORDER ERROR:", repr(e))

        raise HTTPException(
            status_code=500,
            detail="Unable to create Razorpay order. Please check Razorpay credentials.",
        )

    return {
        "free": False,
        "key": RAZORPAY_KEY_ID,
        "amount": amount,
        "currency": "INR",
        "report_type": report_type,
        "order": order,
    }


# ==========================================================
# Verify Payment
# ==========================================================

def verify_payment(
    db: Session,
    email: str,
    report_type: str,
    razorpay_order_id: str,
    razorpay_payment_id: str,
    razorpay_signature: str,
):

    if report_type not in REPORT_PRICES:
        raise HTTPException(
            status_code=400,
            detail="Invalid report type",
        )

    try:

        client.utility.verify_payment_signature(
            {
                "razorpay_order_id": razorpay_order_id,
                "razorpay_payment_id": razorpay_payment_id,
                "razorpay_signature": razorpay_signature,
            }
        )

    except Exception as e:

        print("RAZORPAY VERIFY ERROR:", repr(e))

        raise HTTPException(
            status_code=400,
            detail="Payment verification failed",
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
        payment_date=datetime.now(timezone.utc),
    )

    db.add(payment)
    db.commit()
    db.refresh(payment)

    return payment


# ==========================================================
# Check Paid Report
# ==========================================================

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


# ==========================================================
# Get User Payments
# ==========================================================

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


# ==========================================================
# Check Feature Access
# ==========================================================

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

    print(
        "PAYMENT ACCESS:",
        {
            "user_id": user.id,
            "report_type": report_type,
            "payment": payment,
        }
    )

    return payment is not None


# ==========================================================
# Verify Feature Payment
# ==========================================================

def verify_feature_payment(
    db: Session,
    email: str,
    feature: str,
):

    if feature not in REPORT_PRICES:
        raise HTTPException(
            status_code=400,
            detail="Invalid feature",
        )

    if not has_access(db, email, feature):

        raise HTTPException(
            status_code=403,
            detail=(
                f"Please pay ₹{REPORT_PRICES[feature]} "
                f"to unlock this feature."
            ),
        )

    return True