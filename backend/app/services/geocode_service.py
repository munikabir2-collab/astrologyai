from geopy.geocoders import Nominatim
from timezonefinder import TimezoneFinder
from datetime import datetime
import pytz

geolocator = Nominatim(user_agent="astroai")
tf = TimezoneFinder()


def get_coordinates(place: str):
    location = geolocator.geocode(place)

    if location is None:
        raise Exception(f"Location not found: {place}")

    return {
        "latitude": location.latitude,
        "longitude": location.longitude,
        "address": location.address
    }


def get_timezone(lat, lon):
    tz = tf.timezone_at(lat=lat, lng=lon)

    if tz is None:
        tz = "Asia/Kolkata"

    return pytz.timezone(tz)


def local_to_utc(birth_date, birth_time, lat, lon):
    tz = get_timezone(lat, lon)

    dt = datetime.strptime(
        birth_date + " " + birth_time,
        "%Y-%m-%d %H:%M"
    )

    local = tz.localize(dt)

    return local.astimezone(pytz.utc)