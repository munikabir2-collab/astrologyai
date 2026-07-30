import swisseph as swe
import os

EPHE_PATH = os.path.join(
    os.path.dirname(__file__),
    "../../sweph"
)

swe.set_ephe_path(EPHE_PATH)