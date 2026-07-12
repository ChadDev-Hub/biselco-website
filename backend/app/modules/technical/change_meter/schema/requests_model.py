from pydantic import BaseModel
from datetime import date, datetime 
from typing import Optional
from fastapi import UploadFile

class ChangeMeterReport(BaseModel):
    items:set
    prepared_by: str
    prepared_position: str
    checked_by: str
    checked_position: str
    approved_by: str
    approved_position: str

class ChangeMeterSyncRequests(BaseModel):
    uuid: str
    date_accomplished:date
    account_no: str
    consumer_name: str 
    pull_out_meter: str
    pull_out_meter_serial_no: str
    pull_out_reading: int
    new_meter_serial_no: str
    new_meter_brand: str
    meter_sealed: Optional[str] = None
    initial_reading: int
    remarks: Optional[str] = None
    accomplished_by: str
    is_deleted: Optional[bool] = None
    datetime_deleted: Optional[datetime] = None
    sitio: Optional[str] = None
    lat: float
    lon: float
    image: UploadFile