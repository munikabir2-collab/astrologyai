from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from datetime import datetime

from app.database import Base

class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"))

    plan = Column(String, default="FREE")

    status = Column(String, default="ACTIVE")

    expires_at = Column(DateTime)

    created_at = Column(DateTime, default=datetime.utcnow)