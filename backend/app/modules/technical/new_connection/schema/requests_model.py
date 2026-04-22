from pydantic import BaseModel
from typing import Optional
from fastapi import File
from typing import List


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
    
class NewConnectionDelete(BaseModel):
    items: List[int]
    page: int
    
    
class NewConnectionReportRequests(BaseModel):
    items: List[int]
    prepared_by: str
    prepared_position: str
    checked_by: str
    checked_position: str
    approved_by: str
    approved_position: str
    