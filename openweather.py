import requests
import json


class OpenWeather:
    url_base = "http://api.openweathermap.org/data/2.5/weather?zip=%s,%s&appid=%s&units=%s"

    def __init__(self, api_key):
        self.api_key = api_key

    # units can be standard, metric or imperial
    def get_weather(self, zipcode, country_code, units):
        response = requests.get(self.url_base % (zipcode, country_code, self.api_key, units))
        data = json.loads(response.text)
        return data
