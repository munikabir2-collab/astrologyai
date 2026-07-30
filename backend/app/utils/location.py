from geopy.geocoders import Nominatim


geolocator = Nominatim(
    user_agent="astroai"
)


def get_coordinates(place: str):

    location = geolocator.geocode(place)

    if not location:
        return None


    return {
        "latitude": location.latitude,
        "longitude": location.longitude
    }