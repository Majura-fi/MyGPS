import random
import time

import requests


def postLocation(apikey, lat, lon, accuracy=1, altitude=2, speed=3):
    data = {
        'api_key': apikey,
        'latitude': lat,
        'longitude': lon,
        'accuracy': accuracy,
        'altitude': altitude,
        'speed': speed
    }
    response = requests.post(
        'http://127.0.0.1:5000/paths/location',
        data=data)
    print(response.status_code, response.reason)


def main():
    while True:
        # Finland Box
        # 70.195832, 20.398085           69.895193, 30.301645
        # 59.516209, 20.150702           59.718144, 30.803541

        lat = random.uniform(59.516209, 70.195832)
        lon = random.uniform(20.150702, 30.803541)
        apikey = "0wOU-SDId"
        postLocation(apikey, lat, lon)
        time.sleep(15)


if __name__ == "__main__":
    main()
