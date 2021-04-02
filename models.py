from sqlalchemy import String, Float, DateTime, Integer, Column
from database import Base


class Weather(Base):
    """Model for the weather table"""
    __tablename__ = 'weather'

    id = Column(Integer, primary_key = True)
    zipcode = Column(String)
    country_code = Column(String)
    city = Column(String)
    temperature = Column(Float)
    last_searched = Column(DateTime)
    last_updated = Column(DateTime)
    