from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class WeatherResponse(BaseModel):
    id: int
    zipcode: str
    country_code: str
    city: Optional[str] = None
    temperature: float
    last_searched: datetime
    last_updated: datetime

    class Config:
        orm_mode = True
