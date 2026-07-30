import swisseph as swe
from datetime import datetime, timedelta

from app.services.astrology_engine import julian_day


swe.set_sid_mode(swe.SIDM_LAHIRI)



DASHA_ORDER = [
    "Ketu",
    "Venus",
    "Sun",
    "Moon",
    "Mars",
    "Rahu",
    "Jupiter",
    "Saturn",
    "Mercury"
]


DASHA_YEARS = {

    "Ketu":7,
    "Venus":20,
    "Sun":6,
    "Moon":10,
    "Mars":7,
    "Rahu":18,
    "Jupiter":16,
    "Saturn":19,
    "Mercury":17

}



NAKSHATRA_SIZE = 360/27



def add_years(date, years):

    days = int(years * 365.25)

    return date + timedelta(days=days)



# -----------------------------
# Antardasha Calculation
# -----------------------------

def calculate_antardasha(
    mahadasha_planet,
    start_date,
    mahadasha_years
):


    result=[]


    start_index = DASHA_ORDER.index(
        mahadasha_planet
    )


    current_date=start_date



    for i in range(9):


        planet = DASHA_ORDER[
            (start_index+i)%9
        ]


        # Formula:
        # MD years × AD planet years / 120

        years = (
            mahadasha_years *
            DASHA_YEARS[planet]
            /
            120
        )


        end_date = add_years(
            current_date,
            years
        )


        result.append({

            "planet":planet,

            "years":round(
                years,
                2
            ),

            "start":
            current_date.strftime(
                "%Y-%m-%d"
            ),


            "end":
            end_date.strftime(
                "%Y-%m-%d"
            )

        })


        current_date=end_date



    return result






def get_vimshottari_dasha(
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



    moon = swe.calc_ut(
        jd,
        swe.MOON,
        swe.FLG_SIDEREAL
    )[0][0]



    nak_index=int(
        moon / NAKSHATRA_SIZE
    )



    lord_index = nak_index % 9


    current_lord = DASHA_ORDER[
        lord_index
    ]



    total_years = DASHA_YEARS[
        current_lord
    ]



    position = (
        moon % NAKSHATRA_SIZE
    ) / NAKSHATRA_SIZE



    balance_years = round(
        total_years * (1-position),
        2
    )



    birth = datetime.strptime(
        birth_date,
        "%Y-%m-%d"
    )



    timeline=[]


    current_date=birth



    order_index=lord_index



    for i in range(9):


        planet = DASHA_ORDER[
            order_index%9
        ]



        years=DASHA_YEARS[
            planet
        ]



        if i==0:

            years=balance_years



        end_date=add_years(
            current_date,
            years
        )



        antardasha = calculate_antardasha(
            planet,
            current_date,
            years
        )



        timeline.append({

            "planet":planet,


            "years":round(
                years,
                2
            ),


            "start":
            current_date.strftime(
                "%Y-%m-%d"
            ),


            "end":
            end_date.strftime(
                "%Y-%m-%d"
            ),


            "antardasha":
            antardasha


        })



        current_date=end_date


        order_index+=1




    return {


        "moon_longitude":
        round(
            moon,
            6
        ),



        "nakshatra_number":
        nak_index+1,



        "current_mahadasha":
        timeline[0],



        "vimshottari_dasha":
        timeline

    }