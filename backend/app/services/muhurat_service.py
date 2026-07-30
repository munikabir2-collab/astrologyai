# app/services/muhurat_service.py

from __future__ import annotations

from datetime import date, datetime, timedelta
from typing import Any, Dict, List, Optional
from zoneinfo import ZoneInfo

import swisseph as swe


# ============================================================
# CONSTANTS
# ============================================================

IST = ZoneInfo("Asia/Kolkata")

NAKSHATRAS = [
    "Ashwini",
    "Bharani",
    "Krittika",
    "Rohini",
    "Mrigashira",
    "Ardra",
    "Punarvasu",
    "Pushya",
    "Ashlesha",
    "Magha",
    "Purva Phalguni",
    "Uttara Phalguni",
    "Hasta",
    "Chitra",
    "Swati",
    "Vishakha",
    "Anuradha",
    "Jyeshtha",
    "Mula",
    "Purva Ashadha",
    "Uttara Ashadha",
    "Shravana",
    "Dhanishta",
    "Shatabhisha",
    "Purva Bhadrapada",
    "Uttara Bhadrapada",
    "Revati",
]

TITHIS = [
    "Shukla Pratipada",
    "Shukla Dwitiya",
    "Shukla Tritiya",
    "Shukla Chaturthi",
    "Shukla Panchami",
    "Shukla Shashthi",
    "Shukla Saptami",
    "Shukla Ashtami",
    "Shukla Navami",
    "Shukla Dashami",
    "Shukla Ekadashi",
    "Shukla Dwadashi",
    "Shukla Trayodashi",
    "Shukla Chaturdashi",
    "Purnima",
    "Krishna Pratipada",
    "Krishna Dwitiya",
    "Krishna Tritiya",
    "Krishna Chaturthi",
    "Krishna Panchami",
    "Krishna Shashthi",
    "Krishna Saptami",
    "Krishna Ashtami",
    "Krishna Navami",
    "Krishna Dashami",
    "Krishna Ekadashi",
    "Krishna Dwadashi",
    "Krishna Trayodashi",
    "Krishna Chaturdashi",
    "Amavasya",
]

YOGAS = [
    "Vishkumbha",
    "Preeti",
    "Ayushman",
    "Saubhagya",
    "Shobhana",
    "Atiganda",
    "Sukarma",
    "Dhriti",
    "Shoola",
    "Ganda",
    "Vriddhi",
    "Dhruva",
    "Vyaghata",
    "Harshana",
    "Vajra",
    "Siddhi",
    "Vyatipata",
    "Variyana",
    "Parigha",
    "Shiva",
    "Siddha",
    "Sadhya",
    "Shubha",
    "Shukla",
    "Brahma",
    "Indra",
    "Vaidhriti",
]

KARANAS = [
    "Bava",
    "Balava",
    "Kaulava",
    "Taitila",
    "Garaja",
    "Vanija",
    "Vishti",
]


# ============================================================
# HELPERS
# ============================================================

def normalize_longitude(value: float) -> float:
    return value % 360.0


def format_time(dt: datetime) -> str:
    return dt.strftime("%I:%M %p")


def format_duration(start: datetime, end: datetime) -> str:
    return f"{format_time(start)} - {format_time(end)}"


def decimal_to_dms(value: float) -> str:
    value = value % 360

    degrees = int(value)
    minutes_float = (value - degrees) * 60
    minutes = int(minutes_float)
    seconds = round((minutes_float - minutes) * 60)

    return f"{degrees}° {minutes:02d}' {seconds:02d}\""


# ============================================================
# PLANETARY LONGITUDE
# ============================================================

def get_planet_longitude(jd: float, planet: int) -> float:
    result, _ = swe.calc_ut(jd, planet)
    return normalize_longitude(result[0])


def get_sun_moon_longitudes(jd: float):
    sun = get_planet_longitude(jd, swe.SUN)
    moon = get_planet_longitude(jd, swe.MOON)

    return sun, moon


# ============================================================
# PANCHANG
# ============================================================

def calculate_tithi(sun: float, moon: float) -> Dict[str, Any]:
    difference = normalize_longitude(moon - sun)

    tithi_number = int(difference / 12.0)

    if tithi_number >= 30:
        tithi_number = 29

    percentage = (difference % 12.0) / 12.0 * 100

    return {
        "number": tithi_number + 1,
        "name": TITHIS[tithi_number],
        "progress": round(percentage, 2),
    }


def calculate_nakshatra(moon: float) -> Dict[str, Any]:
    segment = 360.0 / 27.0

    index = int(moon / segment)

    if index >= 27:
        index = 26

    position = moon % segment

    pada = int(position / (segment / 4.0)) + 1

    if pada > 4:
        pada = 4

    return {
        "number": index + 1,
        "name": NAKSHATRAS[index],
        "pada": pada,
    }


def calculate_yoga(sun: float, moon: float) -> Dict[str, Any]:
    total = normalize_longitude(sun + moon)

    segment = 360.0 / 27.0
    index = int(total / segment)

    if index >= 27:
        index = 26

    return {
        "number": index + 1,
        "name": YOGAS[index],
    }


def calculate_karana(sun: float, moon: float) -> Dict[str, Any]:
    difference = normalize_longitude(moon - sun)

    half_tithi = int(difference / 6.0)

    # First half of first tithi
    if half_tithi == 0:
        name = "Kimstughna"

    # Last half of 30th tithi
    elif half_tithi == 59:
        name = "Shakuni"

    elif half_tithi == 58:
        name = "Chatushpada"

    elif half_tithi == 57:
        name = "Naga"

    else:
        name = KARANAS[(half_tithi - 1) % 7]

    return {
        "number": half_tithi + 1,
        "name": name,
    }


# ============================================================
# SUNRISE / SUNSET
# ============================================================

def calculate_sunrise_sunset(
    target_date: date,
    latitude: float,
    longitude: float,
):
    local_midnight = datetime(
        target_date.year,
        target_date.month,
        target_date.day,
        0,
        0,
        0,
        tzinfo=IST,
    )

    # UTC Julian day
    utc = local_midnight.astimezone(ZoneInfo("UTC"))

    jd = swe.julday(
        utc.year,
        utc.month,
        utc.day,
        utc.hour
        + utc.minute / 60
        + utc.second / 3600,
    )

    geopos = (longitude, latitude, 0)

    try:
        rise_result = swe.rise_trans(
            jd,
            swe.SUN,
            geopos,
            rsmi=swe.CALC_RISE,
        )

        set_result = swe.rise_trans(
            jd,
            swe.SUN,
            geopos,
            rsmi=swe.CALC_SET,
        )

        rise_jd = rise_result[1][0]
        set_jd = set_result[1][0]

        rise_date = swe.revjul(rise_jd)
        set_date = swe.revjul(set_jd)

        sunrise_utc = datetime(
            rise_date[0],
            rise_date[1],
            rise_date[2],
            tzinfo=ZoneInfo("UTC"),
        ) + timedelta(hours=rise_date[3])

        sunset_utc = datetime(
            set_date[0],
            set_date[1],
            set_date[2],
            tzinfo=ZoneInfo("UTC"),
        ) + timedelta(hours=set_date[3])

        sunrise = sunrise_utc.astimezone(IST)
        sunset = sunset_utc.astimezone(IST)

        return sunrise, sunset

    except Exception:
        # Safe fallback
        sunrise = datetime(
            target_date.year,
            target_date.month,
            target_date.day,
            6,
            0,
            tzinfo=IST,
        )

        sunset = datetime(
            target_date.year,
            target_date.month,
            target_date.day,
            18,
            0,
            tzinfo=IST,
        )

        return sunrise, sunset


# ============================================================
# DAY PERIODS
# ============================================================

def calculate_day_periods(
    sunrise: datetime,
    sunset: datetime,
):
    duration = (sunset - sunrise) / 8

    periods = []

    for i in range(8):
        start = sunrise + duration * i
        end = sunrise + duration * (i + 1)

        periods.append(
            {
                "index": i,
                "start": start,
                "end": end,
            }
        )

    return periods


def calculate_rahu_kaal(
    sunrise: datetime,
    sunset: datetime,
    weekday: int,
):
    """
    Python weekday:
    Monday = 0
    Sunday = 6
    """

    rahu_index = {
        0: 1,  # Monday
        1: 6,  # Tuesday
        2: 4,  # Wednesday
        3: 5,  # Thursday
        4: 3,  # Friday
        5: 2,  # Saturday
        6: 7,  # Sunday
    }[weekday]

    periods = calculate_day_periods(sunrise, sunset)

    period = periods[rahu_index - 1]

    return {
        "start": period["start"],
        "end": period["end"],
    }


def calculate_yamaganda(
    sunrise: datetime,
    sunset: datetime,
    weekday: int,
):
    yamaganda_index = {
        0: 4,
        1: 3,
        2: 2,
        3: 1,
        4: 0,
        5: 6,
        6: 5,
    }[weekday]

    periods = calculate_day_periods(sunrise, sunset)

    period = periods[yamaganda_index]

    return {
        "start": period["start"],
        "end": period["end"],
    }


def calculate_gulika(
    sunrise: datetime,
    sunset: datetime,
    weekday: int,
):
    gulika_index = {
        0: 6,
        1: 5,
        2: 4,
        3: 3,
        4: 2,
        5: 1,
        6: 0,
    }[weekday]

    periods = calculate_day_periods(sunrise, sunset)

    period = periods[gulika_index]

    return {
        "start": period["start"],
        "end": period["end"],
    }


# ============================================================
# PURPOSE RULES
# ============================================================

PURPOSES = {
    "marriage": {
        "label": "Marriage",
        "label_hi": "विवाह",
        "description": "Marriage and relationship ceremony",
        "preferred_nakshatras": [
            "Rohini",
            "Mrigashira",
            "Magha",
            "Uttara Phalguni",
            "Hasta",
            "Swati",
            "Anuradha",
            "Mula",
            "Uttara Ashadha",
            "Uttara Bhadrapada",
            "Revati",
        ],
        "avoid_tithis": [
            "Amavasya",
            "Chaturthi",
            "Ashtami",
            "Navami",
            "Chaturdashi",
        ],
    },

    "griha_pravesh": {
        "label": "Griha Pravesh",
        "label_hi": "गृह प्रवेश",
        "description": "House entry ceremony",
        "preferred_nakshatras": [
            "Rohini",
            "Mrigashira",
            "Punarvasu",
            "Pushya",
            "Hasta",
            "Anuradha",
            "Dhanishta",
            "Shatabhisha",
            "Revati",
        ],
        "avoid_tithis": [
            "Amavasya",
            "Chaturthi",
            "Navami",
            "Chaturdashi",
        ],
    },

    "vehicle": {
        "label": "Vehicle Purchase",
        "label_hi": "वाहन खरीद",
        "description": "Vehicle purchase or delivery",
        "preferred_nakshatras": [
            "Ashwini",
            "Rohini",
            "Mrigashira",
            "Pushya",
            "Hasta",
            "Swati",
            "Anuradha",
            "Dhanishta",
            "Revati",
        ],
        "avoid_tithis": [
            "Amavasya",
            "Chaturthi",
            "Ashtami",
            "Chaturdashi",
        ],
    },

    "business": {
        "label": "Business Start",
        "label_hi": "व्यवसाय प्रारंभ",
        "description": "Starting a new business or project",
        "preferred_nakshatras": [
            "Ashwini",
            "Rohini",
            "Pushya",
            "Hasta",
            "Chitra",
            "Swati",
            "Anuradha",
            "Shravana",
            "Dhanishta",
            "Revati",
        ],
        "avoid_tithis": [
            "Amavasya",
            "Chaturthi",
            "Navami",
            "Chaturdashi",
        ],
    },

    "property": {
        "label": "Property Purchase",
        "label_hi": "संपत्ति खरीद",
        "description": "Property purchase or registration",
        "preferred_nakshatras": [
            "Rohini",
            "Mrigashira",
            "Pushya",
            "Hasta",
            "Anuradha",
            "Uttara Phalguni",
            "Uttara Ashadha",
            "Uttara Bhadrapada",
        ],
        "avoid_tithis": [
            "Amavasya",
            "Chaturthi",
            "Ashtami",
            "Chaturdashi",
        ],
    },

    "education": {
        "label": "Education",
        "label_hi": "शिक्षा",
        "description": "Study, admission or educational beginning",
        "preferred_nakshatras": [
            "Ashwini",
            "Mrigashira",
            "Punarvasu",
            "Pushya",
            "Hasta",
            "Chitra",
            "Swati",
            "Shravana",
            "Revati",
        ],
        "avoid_tithis": [
            "Amavasya",
            "Chaturthi",
            "Ashtami",
        ],
    },

    "travel": {
        "label": "Travel",
        "label_hi": "यात्रा",
        "description": "Beginning an important journey",
        "preferred_nakshatras": [
            "Ashwini",
            "Punarvasu",
            "Pushya",
            "Hasta",
            "Anuradha",
            "Shravana",
            "Dhanishta",
            "Revati",
        ],
        "avoid_tithis": [
            "Amavasya",
            "Chaturthi",
            "Chaturdashi",
        ],
    },

    "naming": {
        "label": "Naming Ceremony",
        "label_hi": "नामकरण",
        "description": "Naming ceremony",
        "preferred_nakshatras": [
            "Ashwini",
            "Rohini",
            "Mrigashira",
            "Punarvasu",
            "Pushya",
            "Hasta",
            "Chitra",
            "Swati",
            "Anuradha",
            "Revati",
        ],
        "avoid_tithis": [
            "Amavasya",
            "Chaturthi",
            "Ashtami",
            "Chaturdashi",
        ],
    },

    "puja": {
        "label": "Puja",
        "label_hi": "पूजा",
        "description": "Puja and religious activity",
        "preferred_nakshatras": [
            "Pushya",
            "Punarvasu",
            "Hasta",
            "Anuradha",
            "Shravana",
            "Revati",
        ],
        "avoid_tithis": [
            "Amavasya",
        ],
    },

    "construction": {
        "label": "Construction",
        "label_hi": "निर्माण",
        "description": "Construction beginning",
        "preferred_nakshatras": [
            "Rohini",
            "Mrigashira",
            "Pushya",
            "Hasta",
            "Anuradha",
            "Dhanishta",
            "Uttara Phalguni",
            "Uttara Ashadha",
            "Uttara Bhadrapada",
        ],
        "avoid_tithis": [
            "Amavasya",
            "Chaturthi",
            "Navami",
            "Chaturdashi",
        ],
    },
}


# ============================================================
# TIME WINDOW UTILITIES
# ============================================================

def overlaps(
    start1: datetime,
    end1: datetime,
    start2: datetime,
    end2: datetime,
) -> bool:
    return start1 < end2 and end1 > start2


def subtract_bad_periods(
    start: datetime,
    end: datetime,
    bad_periods: List[Dict[str, datetime]],
):
    windows = [(start, end)]

    for bad in bad_periods:
        new_windows = []

        bad_start = bad["start"]
        bad_end = bad["end"]

        for window_start, window_end in windows:

            if not overlaps(
                window_start,
                window_end,
                bad_start,
                bad_end,
            ):
                new_windows.append(
                    (window_start, window_end)
                )
                continue

            if window_start < bad_start:
                new_windows.append(
                    (window_start, bad_start)
                )

            if bad_end < window_end:
                new_windows.append(
                    (bad_end, window_end)
                )

        windows = new_windows

    return windows


# ============================================================
# MUHURAT WINDOWS
# ============================================================

def generate_muhurat_windows(
    sunrise: datetime,
    sunset: datetime,
    rahu: Dict[str, datetime],
    yamaganda: Dict[str, datetime],
    gulika: Dict[str, datetime],
):
    bad_periods = [
        rahu,
        yamaganda,
        gulika,
    ]

    raw_windows = subtract_bad_periods(
        sunrise,
        sunset,
        bad_periods,
    )

    result = []

    for start, end in raw_windows:

        # Ignore very short windows
        if (end - start).total_seconds() < 30 * 60:
            continue

        result.append(
            {
                "start": format_time(start),
                "end": format_time(end),
                "duration_minutes": int(
                    (end - start).total_seconds() / 60
                ),
            }
        )

    return result


# ============================================================
# SCORING
# ============================================================

def score_muhurat(
    purpose: str,
    tithi_name: str,
    nakshatra_name: str,
    yoga_name: str,
):
    config = PURPOSES[purpose]

    score = 50
    reasons = []

    if nakshatra_name in config["preferred_nakshatras"]:
        score += 30
        reasons.append(
            f"{nakshatra_name} is traditionally preferred "
            f"for {config['label'].lower()}."
        )
    else:
        score -= 5

    if tithi_name in config["avoid_tithis"]:
        score -= 30
        reasons.append(
            f"{tithi_name} is treated as less favorable "
            f"for this purpose."
        )
    else:
        score += 10

    if yoga_name in [
        "Preeti",
        "Ayushman",
        "Saubhagya",
        "Shobhana",
        "Sukarma",
        "Dhriti",
        "Harshana",
        "Siddhi",
        "Shiva",
        "Siddha",
        "Sadhya",
        "Shubha",
        "Brahma",
        "Indra",
    ]:
        score += 10
        reasons.append(
            f"{yoga_name} yoga is considered supportive."
        )

    score = max(0, min(100, score))

    if score >= 80:
        rating = "Excellent"
    elif score >= 65:
        rating = "Good"
    elif score >= 50:
        rating = "Moderate"
    else:
        rating = "Needs Caution"

    return score, rating, reasons


# ============================================================
# MAIN FUNCTION
# ============================================================

def calculate_muhurat(
    target_date: str,
    place: str,
    latitude: float,
    longitude: float,
    purpose: str,
    timezone: str = "Asia/Kolkata",
) -> Dict[str, Any]:

    if purpose not in PURPOSES:
        raise ValueError(
            f"Unsupported purpose: {purpose}"
        )

    try:
        selected_date = date.fromisoformat(target_date)
    except ValueError:
        raise ValueError(
            "Date must be YYYY-MM-DD"
        )

    tz = ZoneInfo(timezone)

    # --------------------------------------------------------
    # Sunrise / Sunset
    # --------------------------------------------------------

    sunrise, sunset = calculate_sunrise_sunset(
        selected_date,
        latitude,
        longitude,
    )

    sunrise = sunrise.astimezone(tz)
    sunset = sunset.astimezone(tz)

    # --------------------------------------------------------
    # Planetary positions at local noon
    # --------------------------------------------------------

    local_noon = datetime(
        selected_date.year,
        selected_date.month,
        selected_date.day,
        12,
        0,
        tzinfo=tz,
    )

    utc_noon = local_noon.astimezone(
        ZoneInfo("UTC")
    )

    jd = swe.julday(
        utc_noon.year,
        utc_noon.month,
        utc_noon.day,
        utc_noon.hour
        + utc_noon.minute / 60,
    )

    sun, moon = get_sun_moon_longitudes(jd)

    # --------------------------------------------------------
    # Panchang
    # --------------------------------------------------------

    tithi = calculate_tithi(sun, moon)
    nakshatra = calculate_nakshatra(moon)
    yoga = calculate_yoga(sun, moon)
    karana = calculate_karana(sun, moon)

    weekday = selected_date.weekday()

    # --------------------------------------------------------
    # Dosha periods
    # --------------------------------------------------------

    rahu = calculate_rahu_kaal(
        sunrise,
        sunset,
        weekday,
    )

    yamaganda = calculate_yamaganda(
        sunrise,
        sunset,
        weekday,
    )

    gulika = calculate_gulika(
        sunrise,
        sunset,
        weekday,
    )

    # --------------------------------------------------------
    # Windows
    # --------------------------------------------------------

    windows = generate_muhurat_windows(
        sunrise,
        sunset,
        rahu,
        yamaganda,
        gulika,
    )

    # --------------------------------------------------------
    # Score
    # --------------------------------------------------------

    score, rating, reasons = score_muhurat(
        purpose,
        tithi["name"],
        nakshatra["name"],
        yoga["name"],
    )

    config = PURPOSES[purpose]

    # --------------------------------------------------------
    # Recommendation
    # --------------------------------------------------------

    if score >= 80:
        recommendation = (
            f"{config['label']} ke liye din "
            f"samanya roop se anukool dikh raha hai."
        )
    elif score >= 65:
        recommendation = (
            f"{config['label']} ke liye din "
            f"achha ho sakta hai. Shubh window ka "
            f"upayog karna uchit rahega."
        )
    elif score >= 50:
        recommendation = (
            f"{config['label']} ke liye din madhyam hai. "
            f"Rahu Kaal, Yamaganda aur Gulika se bachkar "
            f"samay chunen."
        )
    else:
        recommendation = (
            f"{config['label']} ke liye is date par "
            f"adhik saavdhani se muhurat chunna chahiye."
        )

    # --------------------------------------------------------
    # Final response
    # --------------------------------------------------------

    return {
        "success": True,

        "purpose": purpose,
        "purpose_label": config["label"],
        "purpose_label_hi": config["label_hi"],

        "date": target_date,
        "place": place,
        "latitude": latitude,
        "longitude": longitude,
        "timezone": timezone,

        "panchang": {
            "sunrise": format_time(sunrise),
            "sunset": format_time(sunset),

            "tithi": tithi,
            "nakshatra": nakshatra,
            "yoga": yoga,
            "karana": karana,

            "sun_longitude": round(sun, 6),
            "moon_longitude": round(moon, 6),
        },

        "inauspicious_periods": {
            "rahu_kaal": format_duration(
                rahu["start"],
                rahu["end"],
            ),
            "yamaganda": format_duration(
                yamaganda["start"],
                yamaganda["end"],
            ),
            "gulika": format_duration(
                gulika["start"],
                gulika["end"],
            ),
        },

        "auspicious_windows": windows,

        "assessment": {
            "score": score,
            "rating": rating,
            "reasons": reasons,
        },

        "recommendation": recommendation,

        "disclaimer": (
            "Muhurat is an astrological calculation intended "
            "for informational and traditional guidance. "
            "For marriage, property, religious or other "
            "important ceremonies, consult a qualified "
            "Jyotish practitioner for a complete personal "
            "muhurat analysis."
        ),
    }