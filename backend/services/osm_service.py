import requests

OVERPASS_URL = "https://overpass-api.de/api/interpreter"


def search_landmark(name):
    query = f"""
    [out:json];
    node["name"~"{name}",i];
    out center 1;
    """

    try:
        response = requests.post(
            OVERPASS_URL,
            data=query,
            timeout=10
        )

        data = response.json()

        if len(data.get("elements", [])) == 0:
            return None

        place = data["elements"][0]

        return {
            "latitude": place["lat"],
            "longitude": place["lon"],
            "name": place.get("tags", {}).get("name", "")
        }

    except Exception:
        return None