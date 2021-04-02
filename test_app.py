from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from datetime import datetime, timedelta
import pytest
import json

from database import Base
from models import Weather
from app import app, get_db

engine = create_engine("sqlite:///test.db")
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base.metadata.create_all(bind=engine)


def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)


@pytest.fixture(scope='function')
def teardown(request):
    def teardown_db():
        db = TestingSessionLocal()
        db.query(Weather).delete()
        db.commit()

    request.addfinalizer(teardown_db)


def test_get_last_searched_oder_by_search_date(teardown):
    db = TestingSessionLocal()
    today = datetime.now()
    yesterday = datetime.now() - timedelta(days=1)
    db_weather_1 = Weather(zipcode='zipcode',
                         country_code='country_code',
                         city='today',
                         temperature=0,
                         last_searched=today,
                         last_updated=today)
    db_weather_2 = Weather(zipcode='zipcode',
                           country_code='country_code',
                           city='yesterday',
                           temperature=0,
                           last_searched=yesterday,
                           last_updated=yesterday)
    db.add(db_weather_1)
    db.add(db_weather_2)
    db.commit()
    response = client.get("/api/weathers/")
    assert response.status_code == 200
    assert len(response.json()["items"]) == 2
    assert response.json()["items"][0]["city"] == "today"


def test_get_last_searched_paging(teardown):
    db = TestingSessionLocal()
    today = datetime.now()
    yesterday = datetime.now() - timedelta(days=1)
    db_weather_1 = Weather(zipcode='zipcode',
                         country_code='country_code',
                         city='today',
                         temperature=0,
                         last_searched=today,
                         last_updated=today)
    db_weather_2 = Weather(zipcode='zipcode',
                           country_code='country_code',
                           city='yesterday',
                           temperature=0,
                           last_searched=yesterday,
                           last_updated=yesterday)
    db.add(db_weather_1)
    db.add(db_weather_2)
    db.commit()
    response = client.get("/api/weathers/?page=0&size=1")
    assert response.status_code == 200
    assert len(response.json()["items"]) == 1
    assert response.json()["total"] == 2


def test_check_weather_first_time(mocker, teardown):

    def mock_openweather(zipcode, country_code, units):
        return {"cod": 200, "name": "mock_owm", "main": { "temp": 25 }}

    mocker.patch('app.owm.get_weather', mock_openweather)

    response = client.get("/api/weathers/88000,BR")
    assert response.json()["temperature"] == 25


def test_check_weather_owm_error(mocker, teardown):

    def mock_openweather(zipcode, country_code, units):
        return {"cod": 404, "message": "city not found"}

    mocker.patch('app.owm.get_weather', mock_openweather)

    response = client.get("/api/weathers/88000,BR")
    assert response.status_code == 404
    assert response.json()["detail"] == "city not found"


def test_check_weather_already_searched_city(mocker, teardown):
    db = TestingSessionLocal()
    today = datetime.now()
    db_weather_1 = Weather(zipcode='88000',
                         country_code='BR',
                         city='today',
                         temperature=0,
                         last_searched=today,
                         last_updated=today)

    db.add(db_weather_1)
    db.commit()

    def mock_openweather(zipcode, country_code, units):
        return {"cod": 200, "name": "today", "main": { "temp": 25 }}

    mocker.patch('app.owm.get_weather', mock_openweather)

    response = client.get("/api/weathers/88000,BR")
    assert response.status_code == 200
    assert response.json()["temperature"] == 0
    assert response.json()["last_searched"] != today.isoformat()
    assert response.json()["last_updated"] == today.isoformat()


def test_check_weather_update_searched_city_one_hour_gap(mocker, teardown):
    db = TestingSessionLocal()
    one_hour_ago = datetime.now() - timedelta(hours=1, seconds=1)
    db_weather_1 = Weather(zipcode='88000',
                         country_code='BR',
                         city='today',
                         temperature=0,
                         last_searched=one_hour_ago,
                         last_updated=one_hour_ago)

    db.add(db_weather_1)
    db.commit()

    def mock_openweather(zipcode, country_code, units):
        return {"cod": 200, "name": "today", "main": { "temp": 25 }}

    mocker.patch('app.owm.get_weather', mock_openweather)

    response = client.get("/api/weathers/88000,BR")
    assert response.status_code == 200
    assert response.json()["temperature"] == 25
    assert response.json()["last_searched"] != one_hour_ago.isoformat()
    assert response.json()["last_updated"] != one_hour_ago.isoformat()


def test_check_weather_update_searched_city_one_day_gap(mocker, teardown):
    db = TestingSessionLocal()
    one_day_ago = datetime.now() - timedelta(days=1)
    db_weather_1 = Weather(zipcode='88000',
                         country_code='BR',
                         city='today',
                         temperature=0,
                         last_searched=one_day_ago,
                         last_updated=one_day_ago)

    db.add(db_weather_1)
    db.commit()

    def mock_openweather(zipcode, country_code, units):
        return {"cod": 200, "name": "today", "main": { "temp": 25 }}

    mocker.patch('app.owm.get_weather', mock_openweather)

    response = client.get("/api/weathers/88000,BR")
    assert response.status_code == 200
    assert response.json()["temperature"] == 25
    assert response.json()["last_searched"] != one_day_ago.isoformat()
    assert response.json()["last_updated"] != one_day_ago.isoformat()
