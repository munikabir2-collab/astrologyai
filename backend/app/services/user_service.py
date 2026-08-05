from app.database import SessionLocal
from app.models.user import User


def get_user_by_email(email: str):

    db = SessionLocal()

    try:
        user = db.query(User).filter(
            User.email == email
        ).first()

        return user

    finally:
        db.close()