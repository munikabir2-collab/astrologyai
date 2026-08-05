from pydantic import BaseModel


class HoroscopeRequest(BaseModel):
    name: str
    email: str
    birth_date: str
    birth_time: str
    birth_place: str



class Insights(BaseModel):
    career: str
    love: str
    health: str
    finance: str
    family: str
    education: str



class LuckyDetails(BaseModel):
    number: str
    color: str
    time: str
    day: str
    direction: str
    gemstone: str
    flower: str



class Spiritual(BaseModel):
    god: str
    mantra: str
    planet: str
    energy: str
    rating: str
    mood: str
    compatibility: str



class Guidance(BaseModel):
    avoid: str
    remedy: str
    activity: str
    advice: str



class AstrologyResponse(BaseModel):

    sign: str
    rashi: str
    nakshatra: str
    prediction: str

    insights: Insights

    lucky_details: LuckyDetails

    spiritual: Spiritual

    guidance: Guidance

    

# ============================================================
# MUHURAT
# ============================================================

class MuhuratRequest(BaseModel):
    target_date: str
    place: str
    latitude: float
    longitude: float
    purpose: str
    timezone: str = "Asia/Kolkata"


class MuhuratPanchang(BaseModel):
    sunrise: str
    sunset: str

    tithi: dict
    nakshatra: dict
    yoga: dict
    karana: dict

    sun_longitude: float
    moon_longitude: float


class InauspiciousPeriods(BaseModel):
    rahu_kaal: str
    yamaganda: str
    gulika: str


class MuhuratWindow(BaseModel):
    start: str
    end: str
    duration_minutes: int


class MuhuratAssessment(BaseModel):
    score: int
    rating: str
    reasons: list[str]


class MuhuratResponse(BaseModel):
    success: bool

    purpose: str
    purpose_label: str
    purpose_label_hi: str

    date: str
    place: str

    latitude: float
    longitude: float
    timezone: str

    panchang: MuhuratPanchang

    inauspicious_periods: InauspiciousPeriods

    auspicious_windows: list[MuhuratWindow]

    assessment: MuhuratAssessment

    recommendation: str

    disclaimer: str
