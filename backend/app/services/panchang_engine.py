import swisseph as swe
from datetime import datetime

from app.services.astrology_engine import julian_day


# Lahiri Ayanamsa
swe.set_sid_mode(swe.SIDM_LAHIRI)


TITHIS = [
    "Pratipada","Dwitiya","Tritiya","Chaturthi","Panchami",
    "Shashthi","Saptami","Ashtami","Navami","Dashami",
    "Ekadashi","Dwadashi","Trayodashi","Chaturdashi","Purnima",
    "Pratipada Krishna","Dwitiya Krishna","Tritiya Krishna",
    "Chaturthi Krishna","Panchami Krishna","Shashthi Krishna",
    "Saptami Krishna","Ashtami Krishna","Navami Krishna",
    "Dashami Krishna","Ekadashi Krishna","Dwadashi Krishna",
    "Trayodashi Krishna","Chaturdashi Krishna","Amavasya"
]


NAKSHATRAS = [
    "Ashwini","Bharani","Krittika","Rohini","Mrigashira",
    "Ardra","Punarvasu","Pushya","Ashlesha","Magha",
    "Purva Phalguni","Uttara Phalguni","Hasta","Chitra",
    "Swati","Vishakha","Anuradha","Jyeshtha","Mula",
    "Purva Ashadha","Uttara Ashadha","Shravana",
    "Dhanishta","Shatabhisha","Purva Bhadrapada",
    "Uttara Bhadrapada","Revati"
]


YOGAS = [
    "Vishkumbha","Priti","Ayushman","Saubhagya","Shobhana",
    "Atiganda","Sukarma","Dhriti","Shoola","Ganda",
    "Vriddhi","Dhruva","Vyaghata","Harshana","Vajra",
    "Siddhi","Vyatipata","Variyana","Parigha","Shiva",
    "Siddha","Sadhya","Shubha","Shukla","Brahma",
    "Indra","Vaidhriti"
]


KARANAS = [
    "Bava","Balava","Kaulava","Taitila",
    "Garaja","Vanija","Vishti",
    "Shakuni","Chatushpada","Naga","Kimstughna"
]


WEEKDAY_EN = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
]


WEEKDAY_HI = [
    "सोमवार",
    "मंगलवार",
    "बुधवार",
    "गुरुवार",
    "शुक्रवार",
    "शनिवार",
    "रविवार"
]


MONTHS = [
    "Chaitra",
    "Vaishakha",
    "Jyeshtha",
    "Ashadha",
    "Shravana",
    "Bhadrapada",
    "Ashwin",
    "Kartika",
    "Margashirsha",
    "Pausha",
    "Magha",
    "Phalguna"
]


def get_panchang(
    birth_date,
    birth_time,
    latitude,
    longitude
):

    jd = julian_day(
        birth_date,
        birth_time,
        latitude,
        longitude
    )


    # Planet positions
    moon = swe.calc_ut(
        jd,
        swe.MOON,
        swe.FLG_SIDEREAL
    )[0][0]


    sun = swe.calc_ut(
        jd,
        swe.SUN,
        swe.FLG_SIDEREAL
    )[0][0]



    # -------------------------
    # Tithi
    # -------------------------

    diff = (moon - sun) % 360

    tithi_index = int(diff / 12)

    if tithi_index >= len(TITHIS):
        tithi_index = len(TITHIS)-1



    # -------------------------
    # Nakshatra
    # -------------------------

    nak_index = int(
        moon / (360 / 27)
    )



    # -------------------------
    # Yoga
    # -------------------------

    yoga_value = (sun + moon) % 360

    yoga_index = int(
        yoga_value / (360 / 27)
    )



    # -------------------------
    # Karana
    # -------------------------

    karana_index = int(diff / 6)

    if karana_index >= len(KARANAS):
        karana_index = len(KARANAS)-1



    # -------------------------
    # Correct Weekday
    # -------------------------

    dt = datetime.strptime(
        birth_date,
        "%Y-%m-%d"
    )


    weekday_number = dt.weekday()


    weekday_en = WEEKDAY_EN[weekday_number]

    weekday_hi = WEEKDAY_HI[weekday_number]



    # -------------------------
    # Paksha
    # -------------------------

    paksha = (
        "Shukla Paksha"
        if diff < 180
        else
        "Krishna Paksha"
    )



    # -------------------------
    # Masa
    # -------------------------

    month = dt.month

    masa = MONTHS[
        (month-1) % 12
    ]



    # -------------------------
    # Ritu
    # -------------------------

    if month in [3,4]:
        ritu="Vasant"

    elif month in [5,6]:
        ritu="Grishma"

    elif month in [7,8]:
        ritu="Varsha"

    elif month in [9,10]:
        ritu="Sharad"

    elif month in [11,12]:
        ritu="Hemant"

    else:
        ritu="Shishir"



    # -------------------------
    # Ayana
    # -------------------------

    ayana = (
        "Uttarayana"
        if month <=6
        else
        "Dakshinayana"
    )



    # Temporary values
    sunrise="05:45 AM"
    sunset="06:12 PM"
    moonrise="03:30 PM"
    moonset="01:40 AM"

    rahu_kal="01:30 PM - 03:00 PM"
    gulika_kal="10:30 AM - 12:00 PM"
    yamaganda="07:30 AM - 09:00 AM"
    abhijit_muhurta="11:50 AM - 12:38 PM"



    return {

        "weekday": weekday_en,

        "weekday_hindi": weekday_hi,


        "tithi": TITHIS[tithi_index],

        "paksha": paksha,

        "masa": masa,

        "ritu": ritu,

        "ayana": ayana,


        "nakshatra": NAKSHATRAS[nak_index],

        "yoga": YOGAS[yoga_index],

        "karana": KARANAS[karana_index],


        "sunrise": sunrise,

        "sunset": sunset,

        "moonrise": moonrise,

        "moonset": moonset,


        "rahu_kal": rahu_kal,

        "gulika_kal": gulika_kal,

        "yamaganda": yamaganda,

        "abhijit_muhurta": abhijit_muhurta,


        "sun_longitude": round(sun,6),

        "moon_longitude": round(moon,6)

    }