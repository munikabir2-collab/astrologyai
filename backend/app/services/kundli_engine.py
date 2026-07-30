# app/services/kundli_engine.py

from app.services.astrology_engine import calculate_chart


def generate_kundli(
    birth_date,
    birth_time,
    latitude,
    longitude
):
    """
    Generate complete Vedic Kundli
    """

    chart = calculate_chart(
        birth_date,
        birth_time,
        latitude,
        longitude
    )

    planets = chart["planets"]
    houses = chart["houses"]
    lagna = chart["lagna"]

    house_planets = {}

    # Initialize all houses
    for i in range(1, 13):
        house_planets[f"House {i}"] = []

    lagna_degree = lagna["longitude"]

    # Assign each planet to a house
    for planet, info in planets.items():

        diff = (info["longitude"] - lagna_degree) % 360

        house = int(diff // 30) + 1

        house_planets[f"House {house}"].append({
            "planet": planet,
            "longitude": info["longitude"],
            "rashi": info["rashi"]
        })

    return {

        "lagna": lagna,

        "houses": houses,

        "planets": planets,

        "house_planets": house_planets

    }


def get_house_details(kundli):

    result = []

    for house in range(1, 13):

        key = f"House {house}"

        result.append({

            "house": house,

            "cusp": kundli["houses"][key],

            "planets": kundli["house_planets"][key]

        })

    return result


def get_planet_summary(kundli):

    summary = {}

    for planet, data in kundli["planets"].items():

        summary[planet] = {

            "rashi": data["rashi"],

            "longitude": data["longitude"]

        }

    return summary


def get_kundli_report(
    birth_date,
    birth_time,
    latitude,
    longitude
):

    kundli = generate_kundli(
        birth_date,
        birth_time,
        latitude,
        longitude
    )

    return {

        "lagna": kundli["lagna"],

        "planet_summary": get_planet_summary(kundli),

        "houses": get_house_details(kundli)

    }