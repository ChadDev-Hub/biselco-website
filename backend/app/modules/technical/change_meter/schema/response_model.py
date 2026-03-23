from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Dict, Any
from datetime import date

class Geometry:
    type:str
    coordinates:List[float]

class ChangeMeterResponse(BaseModel):
    id:int
    date_accomplished:date
    account_no:str
    consumer_name:str
    location:str
    pull_out_meter:str
    pull_out_meter_reading:int
    new_meter_serial_no:str
    new_meter_brand:str
    initial_reading:int
    remarks: Optional[str] = None
    accomplished_by:str
    
    geom: Dict[str, Any]

    model_config = ConfigDict(from_attributes=True)
    
class Stats(BaseModel):
    title: str
    value: int
    description: str
    
class ChangeMeterResponseList(BaseModel):
    data:List[ChangeMeterResponse]
    total_page:int
    stats: List[Stats]

class ChangeMeterReportResponse(BaseModel):
    date_accomplished: date
    account_no: str
    consumer_name: str
    location: str
    pull_out_meter: str
    pull_out_meter_reading: int
    new_meter_serial_no: str
    new_meter_brand: str
    meter_sealed: int
    initial_reading: int
    remarks: Optional[str] = None
    accomplished_by: str
    
    model_config = ConfigDict(from_attributes=True)