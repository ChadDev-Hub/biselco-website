from pydantic import BaseModel
from typing import Optional
from fastapi import UploadFile
from typing import List
from datetime import date
from ....gis.franchise_area.services.get_location import verifyLocation

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


class NewConnectionSyncRequests(BaseModel):
    uuid: str
    date_accomplished: date
    consumer_name:str
    meter_brand: str
    meter_serial_no:str
    meter_sealed: Optional[str] = None
    multiplier: int
    initial_reading: int
    remarks: Optional[str] = None
    accomplished_by: str
    image: UploadFile
    lat: float
    lon: float
    sitio: Optional[str] = None