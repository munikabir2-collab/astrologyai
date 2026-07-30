import swisseph as swe

from app.services.geocode_service import (
    local_to_utc
)

# ---------------------------------
# Lahiri Ayanamsa
# ---------------------------------

swe.set_sid_mode(swe.SIDM_LAHIRI)

PLANETS = {
    "Sun": swe.SUN,
    "Moon": swe.MOON,
    "Mars": swe.MARS,
    "Mercury": swe.MERCURY,
    "Jupiter": swe.JUPITER,
    "Venus": swe.VENUS,
    "Saturn": swe.SATURN,
    "Rahu": swe.MEAN_NODE
}

RASHIS = [
    "Aries",
    "Taurus",
    "Gemini",
    "Cancer",
    "Leo",
    "Virgo",
    "Libra",
    "Scorpio",
    "Sagittarius",
    "Capricorn",
    "Aquarius",
    "Pisces"
]

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
    "Revati"
]


# ---------------------------------
# Julian Day
# ---------------------------------

def julian_day(
    birth_date,
    birth_time,
    lat,
    lon
):

    utc = local_to_utc(
        birth_date,
        birth_time,
        lat,
        lon
    )

    jd = swe.julday(
        utc.year,
        utc.month,
        utc.day,
        utc.hour
        + utc.minute / 60
        + utc.second / 3600
    )

    return jd


# ---------------------------------
# Planet Positions
# ---------------------------------

def get_planet_positions(jd):

    planets = {}

    for name, planet in PLANETS.items():

        pos = swe.calc_ut(
            jd,
            planet,
            swe.FLG_SIDEREAL
        )

        longitude = pos[0][0]

        rashi = RASHIS[int(longitude // 30)]

        nak_index = int(longitude / (360 / 27))

        planets[name] = {

            "longitude": round(longitude, 6),

            "rashi": rashi,

            "nakshatra": NAKSHATRAS[nak_index]

        }

    # --------------------------
    # Ketu
    # --------------------------

    rahu = planets["Rahu"]["longitude"]

    ketu = (rahu + 180) % 360

    planets["Ketu"] = {

        "longitude": round(ketu, 6),

        "rashi": RASHIS[int(ketu // 30)],

        "nakshatra":
        NAKSHATRAS[int(ketu / (360 / 27))]

    }

    return planets


# ---------------------------------
# Ascendant
# ---------------------------------

def get_ascendant(
    jd,
    lat,
    lon
):

    houses = swe.houses_ex(
        jd,
        lat,
        lon,
        b'P',
        swe.FLG_SIDEREAL
    )

    asc = houses[1][0]

    return {

        "longitude": round(asc, 6),

        "rashi": RASHIS[int(asc // 30)]

    }


# ---------------------------------
# Houses
# ---------------------------------

def get_houses(
    jd,
    lat,
    lon
):

    houses = swe.houses_ex(
        jd,
        lat,
        lon,
        b'P',
        swe.FLG_SIDEREAL
    )

    result = {}

    for i in range(12):

        degree = houses[0][i]

        result[f"House {i+1}"] = {

            "longitude": round(degree, 6),

            "rashi": RASHIS[int(degree // 30)]

        }

    return result


# ---------------------------------
# Moon Details
# ---------------------------------

def get_moon_details(planets):

    moon = planets["Moon"]

    return {

        "rashi": moon["rashi"],

        "nakshatra": moon["nakshatra"]

    }


# ---------------------------------
# Full Chart
# ---------------------------------

def calculate_chart(
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

    planets = get_planet_positions(jd)

    lagna = get_ascendant(
        jd,
        latitude,
        longitude
    )

    houses = get_houses(
        jd,
        latitude,
        longitude
    )

    moon = get_moon_details(planets)

    return {

        "julian_day": round(jd, 6),

        "lagna": lagna,

        "moon": moon,

        "houses": houses,

        "planets": planets

    }