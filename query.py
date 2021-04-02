from sqlalchemy.orm import Session
from fastapi_pagination import Params
from fastapi_pagination.ext.sqlalchemy import paginate
from datetime import datetime

from models import Weather


def get_last_searched(params: Params, db: Session):
    return paginate(db.query(Weather).order_by(Weather.last_searched.desc()), params)


def get_weather(db: Session, zipcode: str, country_code: str):
    return db.query(Weather)\
        .filter(Weather.zipcode == zipcode,
                Weather.country_code == country_code.upper())\
        .first()


def update_search_date(db: Session, time: datetime, weather: Weather):
    weather.last_searched = time
    db.commit()
    db.refresh(weather)
    return weather


def update_temperature(db: Session, time: datetime, temperature: float, weather: Weather):
    weather.last_searched = time
    weather.last_updated = time
    weather.temperature = temperature
    db.commit()
    db.refresh(weather)
    return weather



def create_weather(db: Session, zipcode: str, country_code: str, city: str, temperature: float, time: datetime):
    db_weather = Weather(zipcode=zipcode,
                            country_code=country_code.upper(),
                            city=city,
                            temperature=temperature,
                            last_searched=time,
                            last_updated=time)
    db.add(db_weather)
    db.commit()
    db.refresh(db_weather)
    return db_weather