import uvicorn
import os

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi_pagination import Page, Params
from sqlalchemy.orm import Session
from dotenv import load_dotenv
from datetime import datetime
from openweather import OpenWeather

import query
from models import Weather
from schema import WeatherResponse
from database import SessionLocal, Base, engine

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(BASE_DIR, ".env"))

owm_api_key = os.environ["OPENWEATHER_API_KEY"]
owm = OpenWeather(owm_api_key)

Base.metadata.create_all(bind=engine)

app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


origins = [
    "http://localhost:3000",
    "localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.get("/api/weathers/{zipcode},{country_code}", response_model=WeatherResponse)
def check_weather(zipcode: str, country_code: str, db: Session = Depends(get_db)):
    units = "imperial"
    current_time = datetime.now()
    cache_weather = query.get_weather(db, zipcode, country_code)

    if cache_weather:
        if (current_time - cache_weather.last_updated).seconds > 3600\
        or (current_time - cache_weather.last_updated).days > 0:
            data = owm.get_weather(zipcode, country_code, units)
            return query.update_temperature(db, current_time, data["main"]["temp"], cache_weather)

        return query.update_search_date(db, current_time, cache_weather)

    else:
        data = owm.get_weather(zipcode, country_code, units)
        if data["cod"] == 200:
            return query.create_weather(db, zipcode, country_code, data["name"], data["main"]["temp"], current_time)
        else:
            raise HTTPException(status_code=int(data["cod"]), detail=data["message"])


@app.get("/api/weathers/", response_model=Page[WeatherResponse], response_model_exclude_unset=True)
def read_weathers(params: Params = Depends(), db: Session = Depends(get_db)):
    return query.get_last_searched(params, db)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)