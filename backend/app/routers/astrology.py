from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form
from pydantic import BaseModel
from app.services.kundli_engine import get_kundli_report
from app.services.geocode_service import get_coordinates
from app.services.astrology_engine import calculate_chart
from app.services.panchang_engine import get_panchang
from app.services.dasha_engine import get_vimshottari_dasha
from app.services.astrology_ai_service import generate_astrology_report
from app.services.user_service import get_user_by_email
from app.services.pdf_service import generate_pdf
from fastapi.responses import Response
from app.services.muhurat_service import calculate_muhurat
from app.services.payment_service import has_access
from sqlalchemy.orm import Session
from app.services.payment_service import verify_feature_payment
from app.database import get_db
from app.services.palm_service import analyze_palm

from app.schemas.astrology import (
    HoroscopeRequest,
    AstrologyResponse,
    MuhuratRequest,
    MuhuratResponse,
)


router = APIRouter(
    prefix="/astrology",
    tags=["Astrology"]
)



@router.post("/horoscope")
def horoscope(
    data: HoroscopeRequest,
    db: Session = Depends(get_db),
):
    # ==========================================================
    # 1. VALIDATE INPUT
    # ==========================================================

    if not data.name or not data.name.strip():
        raise HTTPException(
            status_code=400,
            detail="Name is required.",
        )

    if not data.email or not data.email.strip():
        raise HTTPException(
            status_code=400,
            detail="Email is required.",
        )

    if not data.birth_date:
        raise HTTPException(
            status_code=400,
            detail="Birth date is required.",
        )

    if not data.birth_time:
        raise HTTPException(
            status_code=400,
            detail="Birth time is required.",
        )

    if not data.birth_place or not data.birth_place.strip():
        raise HTTPException(
            status_code=400,
            detail="Birth place is required.",
        )

    # ==========================================================
    # 2. PAYMENT CHECK
    # ==========================================================

    email = data.email.strip().lower()

    has_horoscope_access = has_access(
        db=db,
        email=email,
        report_type="horoscope",
    )

    print("====================================")
    print("HOROSCOPE ACCESS CHECK")
    print("EMAIL:", email)
    print("REPORT TYPE:", "horoscope")
    print("HAS ACCESS:", has_horoscope_access)
    print("====================================")

    if not has_horoscope_access:
        raise HTTPException(
            status_code=403,
            detail="Please purchase Horoscope Report.",
        )

    # ==========================================================
    # 3. GENERATE REPORT
    # ==========================================================

    try:
        location = get_coordinates(
            data.birth_place.strip()
        )

        if not location:
            raise ValueError(
                "Unable to find birth place coordinates."
            )

        latitude = location["latitude"]
        longitude = location["longitude"]

        chart = calculate_chart(
            birth_date=data.birth_date,
            birth_time=data.birth_time,
            latitude=latitude,
            longitude=longitude,
        )

        panchang = get_panchang(
            data.birth_date,
            data.birth_time,
            latitude,
            longitude,
        )

        dasha = get_vimshottari_dasha(
            data.birth_date,
            data.birth_time,
            latitude,
            longitude,
        )

        report = generate_astrology_report(
            chart,
            panchang,
            dasha,
        )

        return {
            "success": True,
            "name": data.name,
            "email": email,

            "birth_details": {
                "date": data.birth_date,
                "time": data.birth_time,
                "place": data.birth_place,
            },

            "location": {
                "latitude": latitude,
                "longitude": longitude,
            },

            "chart": chart,
            "panchang": panchang,
            "dasha": dasha,
            "gemini_report": report,
        }

    except HTTPException:
        raise

    except Exception as e:
        print(
            "HOROSCOPE REPORT ERROR:",
            repr(e),
        )

        raise HTTPException(
            status_code=500,
            detail=str(e),
        )
@router.get("/prediction")
def prediction(sign: str):

    predictions = {

        "aries": {
            "sign": "Aries",
            "rashi": "मेष",
            "nakshatra": "Ashwini",
            "prediction": "Today is favorable for starting new projects.",
            "career": "Promotion chances are high.",
            "love": "A pleasant surprise from your partner.",
            "health": "Take care of digestion.",
            "finance": "Good day for investments.",
            "lucky_number": "9",
            "lucky_color": "Red",
            "lucky_day": "Tuesday",
            "lucky_mantra": "ॐ मंगलाय नमः",
            "remedy": "Donate red lentils."
        },

        "taurus": {
            "sign": "Taurus",
            "rashi": "वृषभ",
            "nakshatra": "Rohini",
            "prediction": "Today is good for financial planning.",
            "career": "Hard work brings success.",
            "love": "Spend quality time with loved ones.",
            "health": "Stay hydrated.",
            "finance": "Avoid unnecessary expenses.",
            "lucky_number": "6",
            "lucky_color": "Green",
            "lucky_day": "Friday",
            "lucky_mantra": "ॐ शुक्राय नमः",
            "remedy": "Donate white sweets."
        },

        "gemini": {
            "sign": "Gemini",
            "rashi": "मिथुन",
            "nakshatra": "Mrigashira",
            "prediction": "Communication will bring new opportunities.",
            "career": "Networking benefits your career.",
            "love": "Express your feelings honestly.",
            "health": "Avoid stress.",
            "finance": "Good day for business.",
            "lucky_number": "5",
            "lucky_color": "Yellow",
            "lucky_day": "Wednesday",
            "lucky_mantra": "ॐ बुधाय नमः",
            "remedy": "Feed green fodder to cows."
        },

        "cancer": {
            "sign": "Cancer",
            "rashi": "कर्क",
            "nakshatra": "Pushya",
            "prediction": "Family support will help you.",
            "career": "Focus on teamwork.",
            "love": "Romantic day.",
            "health": "Take proper rest.",
            "finance": "Income may increase.",
            "lucky_number": "2",
            "lucky_color": "White",
            "lucky_day": "Monday",
            "lucky_mantra": "ॐ सोमाय नमः",
            "remedy": "Offer milk to Shiva."
        },

        "leo": {
            "sign": "Leo",
            "rashi": "सिंह",
            "nakshatra": "Magha",
            "prediction": "Leadership brings success.",
            "career": "Recognition at work.",
            "love": "Good relationship growth.",
            "health": "Maintain exercise.",
            "finance": "Profits are expected.",
            "lucky_number": "1",
            "lucky_color": "Gold",
            "lucky_day": "Sunday",
            "lucky_mantra": "ॐ सूर्याय नमः",
            "remedy": "Offer water to the Sun."
        },

        "virgo": {
            "sign": "Virgo",
            "rashi": "कन्या",
            "nakshatra": "Hasta",
            "prediction": "Focus on details today.",
            "career": "Success through discipline.",
            "love": "Avoid overthinking.",
            "health": "Eat healthy food.",
            "finance": "Savings increase.",
            "lucky_number": "7",
            "lucky_color": "Green",
            "lucky_day": "Wednesday",
            "lucky_mantra": "ॐ बुधाय नमः",
            "remedy": "Donate green vegetables."
        },

        "libra": {
            "sign": "Libra",
            "rashi": "तुला",
            "nakshatra": "Chitra",
            "prediction": "Today is favorable for balance and harmony.",
            "career": "Communication skills will impress others.",
            "love": "Relationships will strengthen.",
            "health": "Take adequate rest.",
            "finance": "Review financial plans.",
            "lucky_number": "6",
            "lucky_color": "Pink",
            "lucky_day": "Friday",
            "lucky_mantra": "ॐ शुक्राय नमः",
            "remedy": "Donate white sweets."
        },

        "scorpio": {
            "sign": "Scorpio",
            "rashi": "वृश्चिक",
            "nakshatra": "Anuradha",
            "prediction": "Determination brings success.",
            "career": "Hard work will be recognized.",
            "love": "Trust will strengthen relationships.",
            "health": "Avoid stress.",
            "finance": "Good day for savings.",
            "lucky_number": "9",
            "lucky_color": "Maroon",
            "lucky_day": "Tuesday",
            "lucky_mantra": "ॐ मंगलाय नमः",
            "remedy": "Offer red flowers to Hanuman."
        },

        "sagittarius": {
            "sign": "Sagittarius",
            "rashi": "धनु",
            "nakshatra": "Moola",
            "prediction": "Learning brings success.",
            "career": "New opportunities may arise.",
            "love": "Meaningful conversations strengthen bonds.",
            "health": "Take care of your diet.",
            "finance": "Avoid risky investments.",
            "lucky_number": "3",
            "lucky_color": "Purple",
            "lucky_day": "Thursday",
            "lucky_mantra": "ॐ बृहस्पतये नमः",
            "remedy": "Donate yellow gram."
        },

        "capricorn": {
            "sign": "Capricorn",
            "rashi": "मकर",
            "nakshatra": "Shravana",
            "prediction": "Patience brings success.",
            "career": "Leadership appreciated.",
            "love": "Spend time with loved ones.",
            "health": "Avoid overwork.",
            "finance": "Good day for saving money.",
            "lucky_number": "8",
            "lucky_color": "Dark Blue",
            "lucky_day": "Saturday",
            "lucky_mantra": "ॐ शनैश्चराय नमः",
            "remedy": "Donate black sesame."
        },

        "aquarius": {
            "sign": "Aquarius",
            "rashi": "कुंभ",
            "nakshatra": "Shatabhisha",
            "prediction": "Innovation brings success.",
            "career": "Creative ideas will be appreciated.",
            "love": "Relationships improve.",
            "health": "Stay hydrated.",
            "finance": "Long-term investments are favorable.",
            "lucky_number": "8",
            "lucky_color": "Blue",
            "lucky_day": "Saturday",
            "lucky_mantra": "ॐ शनैश्चराय नमः",
            "remedy": "Donate black sesame."
        },

        "pisces": {
            "sign": "Pisces",
            "rashi": "मीन",
            "nakshatra": "Revati",
            "prediction": "Spirituality brings peace.",
            "career": "Intuition helps in decisions.",
            "love": "Romantic atmosphere.",
            "health": "Practice meditation.",
            "finance": "Avoid impulsive spending.",
            "lucky_number": "7",
            "lucky_color": "Sea Green",
            "lucky_day": "Thursday",
            "lucky_mantra": "ॐ गुरवे नमः",
            "remedy": "Offer bananas to Vishnu."
        }
    }

    prediction_data = predictions.get(sign.strip().lower())

    if prediction_data is None:
        raise HTTPException(
            status_code=404,
            detail="Prediction not available."
        )

    return prediction_data
@router.post("/kundli")
def kundli(request: HoroscopeRequest):

    location = get_coordinates(request.birth_place)

    report = get_kundli_report(
        request.birth_date,
        request.birth_time,
        location["latitude"],
        location["longitude"]
    )

    return report    



@router.get("/panchang")
def panchang(
    date: str,
    time: str,
    place: str,
):
    try:
        location = get_coordinates(place)

        data = get_panchang(
            date,
            time,
            location["latitude"],
            location["longitude"],
        )

        return {
            "success": True,
            "date": date,
            "time": time,
            "place": place,
            "latitude": location["latitude"],
            "longitude": location["longitude"],
            "panchang": data,
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e),
        )    



@router.get("/dasha")
def dasha(
    email: str,
    date: str,
    time: str,
    place: str,
    db: Session = Depends(get_db),
    ):
    try:
        # Payment Check
        verify_feature_payment(
            db=db,
            email=email,
            feature="dasha",
        )
        # Location
        location = get_coordinates(place)
        latitude = location["latitude"]
        longitude = location["longitude"]

        # Birth Chart
        chart = calculate_chart(
            birth_date=date,
            birth_time=time,
            latitude=latitude,
            longitude=longitude,
        )

        # Panchang
        panchang = get_panchang(
            date,
            time,
            latitude,
            longitude,
        )

        # Dasha
        dasha_result = get_vimshottari_dasha(
            birth_date=date,
            birth_time=time,
            latitude=latitude,
            longitude=longitude,
        )

        # Gemini AI Report
        ai_report = generate_astrology_report(
            chart,
            panchang,
            dasha_result,
        )

        return {
            "success": True,

            "birth_details": {
                "date": date,
                "time": time,
                "place": place,
            },

            "location": {
                "latitude": latitude,
                "longitude": longitude,
            },

            "chart": chart,
            "panchang": panchang,
            "dasha": dasha_result,
            "ai_report": ai_report,
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e),
@router.post("/download-pdf")
def download_pdf(
    data: HoroscopeRequest,
    db: Session = Depends(get_db),
):
    try:

        # ======================================================
        # 1. NORMALIZE EMAIL
        # ======================================================

        email = data.email.strip().lower()

        # ======================================================
        # 2. PAYMENT CHECK
        # ======================================================

        has_horoscope_access = has_access(
            db=db,
            email=email,
            report_type="horoscope",
        )

        print("====================================")
        print("HOROSCOPE PDF PAYMENT CHECK")
        print("EMAIL:", email)
        print("REPORT TYPE:", "horoscope")
        print("HAS ACCESS:", has_horoscope_access)
        print("====================================")

        if not has_horoscope_access:
            raise HTTPException(
                status_code=403,
                detail="Please purchase Horoscope Report first.",
            )

        # ======================================================
        # 3. LOCATION
        # ======================================================

        location = get_coordinates(
            data.birth_place.strip()
        )

        if not location:
            raise HTTPException(
                status_code=400,
                detail="Unable to find birth place coordinates.",
            )

        latitude = location["latitude"]
        longitude = location["longitude"]

        # ======================================================
        # 4. BIRTH CHART
        # ======================================================

        chart = calculate_chart(
            birth_date=data.birth_date,
            birth_time=data.birth_time,
            latitude=latitude,
            longitude=longitude,
        )

        # ======================================================
        # 5. PANCHANG
        # ======================================================

        panchang_data = get_panchang(
            data.birth_date,
            data.birth_time,
            latitude,
            longitude,
        )

        # ======================================================
        # 6. DASHA
        # ======================================================

        dasha_result = get_vimshottari_dasha(
            data.birth_date,
            data.birth_time,
            latitude,
            longitude,
        )

        # ======================================================
        # 7. AI REPORT
        # ======================================================

        ai_report = generate_astrology_report(
            chart,
            panchang_data,
            dasha_result,
        )

        # ======================================================
        # 8. PDF DATA
        # ======================================================

        report = {
            "title": "AstroAI Professional Horoscope Report",

            "name": data.name,

            "email": email,

            "birth_details": {
                "date": data.birth_date,
                "time": data.birth_time,
                "place": data.birth_place,
            },

            "location": {
                "latitude": latitude,
                "longitude": longitude,
            },

            "chart": chart,

            "panchang": panchang_data,

            "dasha": dasha_result,

            "ai_report": ai_report,
        }

        # ======================================================
        # 9. GENERATE PDF
        # ======================================================

        pdf = generate_pdf(report)

        if not pdf:
            raise ValueError(
                "PDF generation returned empty data."
            )

        # ======================================================
        # 10. RETURN PDF
        # ======================================================

        return Response(
            content=pdf,
            media_type="application/pdf",
            headers={
                "Content-Disposition": (
                    'attachment; filename="AstroAI_Horoscope_Report.pdf"'
                )
            },
        )

    except HTTPException:
        raise

    except Exception as e:

        print(
            "HOROSCOPE PDF ERROR:",
            repr(e),
        )

        raise HTTPException(
            status_code=500,
            detail=str(e),
        )
@router.post("/muhurat")
def get_muhurat(
    request: MuhuratRequest,
    db: Session = Depends(get_db),
):
    try:

        # Payment Verification
        verify_feature_payment(
            db=db,
            email=request.email,
            feature="muhurat",
        )

        # Muhurat Calculation
        return calculate_muhurat(
            target_date=request.target_date,
            place=request.place,
            latitude=request.latitude,
            longitude=request.longitude,
            purpose=request.purpose,
            timezone=request.timezone,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Muhurat calculation failed: {str(e)}",
        )




@router.post("/palm-reading")
async def palm_reading(
    email: str = Form(...),
    name: str = Form(...),
    image: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    email = email.strip().lower()

    if not has_access(
        db=db,
        email=email,
        report_type="palm",
    ):
        raise HTTPException(
            status_code=403,
            detail="Please purchase Palm Reading Report.",
        )

    result = await analyze_palm(
        email=email,
        name=name,
        image=image,
    )

    return result