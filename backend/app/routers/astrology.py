from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.kundli_engine import get_kundli_report
from app.services.geocode_service import get_coordinates
from app.services.astrology_engine import calculate_chart
from app.services.panchang_engine import get_panchang
from app.services.dasha_engine import get_vimshottari_dasha
from app.services.astrology_ai_service import generate_astrology_report
from app.services.pdf_service import generate_pdf
from fastapi.responses import Response
from app.services.muhurat_service import calculate_muhurat
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


class HoroscopeRequest(BaseModel):
    name: str
    birth_date: str      # YYYY-MM-DD
    birth_time: str      # HH:MM
    birth_place: str


@router.post("/horoscope")
def horoscope(data: HoroscopeRequest):
    try:
        location = get_coordinates(data.birth_place)

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

    except Exception as e:
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
        }

    }

    return predictions.get(
        sign.lower(),
        {
            "sign": sign,
            "prediction": "Prediction not available."
        }
    )


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
    date: str,
    time: str,
    place: str,
):
    try:
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
        )

@router.post("/download-pdf")
def download_pdf(data: HoroscopeRequest):
     
    # Temporary Demo Check
    is_pro = False

    if not is_pro:
        raise HTTPException(
            status_code=403,
            detail="Please subscribe to Pro plan to download PDF."
        )

    try:

        # Location
        location = get_coordinates(
            data.birth_place
        )

        latitude = location["latitude"]
        longitude = location["longitude"]


        # Kundli Chart
        chart = calculate_chart(
            birth_date=data.birth_date,
            birth_time=data.birth_time,
            latitude=latitude,
            longitude=longitude,
        )


        # Panchang
        panchang_data = get_panchang(
            data.birth_date,
            data.birth_time,
            latitude,
            longitude,
        )


        # Vimshottari Dasha
        dasha_result = get_vimshottari_dasha(
            data.birth_date,
            data.birth_time,
            latitude,
            longitude,
        )


        # Gemini AI
        ai_report = generate_astrology_report(
            chart,
            panchang_data,
            dasha_result,
        )


        report = {

            "title":
            "AstroAI Professional Kundli Report",


            "name":
            data.name,


            "birth_details": {

                "date":
                data.birth_date,

                "time":
                data.birth_time,

                "place":
                data.birth_place

            },


            "location": {

                "latitude":
                latitude,

                "longitude":
                longitude

            },


            "chart":
            chart,


            "panchang":
            panchang_data,


            "dasha":
            dasha_result,


            "ai_report":
            ai_report

        }


        pdf = generate_pdf(report)


        return Response(

            content=pdf,

            media_type="application/pdf",

            headers={

                "Content-Disposition":
                'attachment; filename="AstroAI_Kundli_Report.pdf"'

            }

        )


    except Exception as e:

        print("PDF ERROR:", e)

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )



@router.post(
    "/muhurat",
    response_model=MuhuratResponse,
)
def get_muhurat(request: MuhuratRequest):

    try:
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
            "price": 499,
            "features": [
                "Unlimited AI",
                "Kundli PDF",
                "Muhurat",
                "Panchang"
            ]
        }
    ]        