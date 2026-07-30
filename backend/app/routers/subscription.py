from fastapi import APIRouter

router = APIRouter(
    prefix="/subscription",
    tags=["Subscription"]
)

@router.get("/plans")
def plans():
    return [
        {
            "id": 1,
            "name": "Free",
            "price": 0,
            "features": [
                "Daily Horoscope",
                "Limited AI"
            ]
        },
        {
            "id": 2,
            "name": "Pro",
            "price": 1,
            "features": [
                "Unlimited AI",
                "Kundli PDF",
                "Muhurat",
                "Panchang"
            ]
        }
    ]

@router.post("/buy")
def buy(plan: str):
    return {
        "success": True,
        "plan": plan,
        "message": "Proceed to payment"
    }    