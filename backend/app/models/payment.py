from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    ForeignKey,
)

from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class Payment(Base):
    __tablename__ = "payments"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    report_type = Column(
        String(100),
        nullable=False,
        index=True,
    )

    # Amount in Rupees
    amount = Column(
        Integer,
        nullable=False,
    )

    currency = Column(
        String(10),
        default="INR",
        nullable=False,
    )

    payment_gateway = Column(
        String(50),
        default="razorpay",
        nullable=False,
    )

    receipt = Column(
        String(255),
        nullable=True,
    )

    order_id = Column(
        String(255),
        unique=True,
        nullable=False,
        index=True,
    )

    payment_id = Column(
        String(255),
        unique=True,
        nullable=True,
        index=True,
    )

    signature = Column(
        String(255),
        nullable=True,
    )

    # PENDING | PAID | FAILED | REFUNDED
    status = Column(
        String(30),
        default="PENDING",
        nullable=False,
        index=True,
    )

    payment_date = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )

    user = relationship(
        "User",
        back_populates="payments",
    )