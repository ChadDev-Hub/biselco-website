from pydantic import BaseModel
from typing import Optional
from fastapi import File



class NewConnectionRequest(BaseModel):
    date: str
    account_no: str
    consumer_name: str
    meter_serial_no: str
    meter_brand: str
    meter_sealed: Optional[str] = None
    lon: float
    lat: float
    inital_reading: int
    remarks: Optional[str] = None