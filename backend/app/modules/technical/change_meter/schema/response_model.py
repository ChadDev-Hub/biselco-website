from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Dict, Any
from datetime import date
from .....common.schema.response import PointCoordinates, Stats
    
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
    images: Optional[List[str]] = None
    geom: PointCoordinates

    model_config = ConfigDict(from_attributes=True)

    
class ChangeMeterResponseList(BaseModel):
    data:List[ChangeMeterResponse]
    total_page:int
    stats: List[Stats]

class ChangeMeterData(BaseModel):
    change_meter_data: ChangeMeterResponse
    change_meter_stats: List[Stats]
    
    model_config = ConfigDict(from_attributes=True)

class NewChangeMeterResponse(BaseModel):
    detail: str
    message: str
    number_of_features: int
    total_page: int
    data: ChangeMeterData
    
    
class DeletedChangeMeterResponse(BaseModel):
    detail: str
    message: str
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
    meter_sealed: str
    initial_reading: int
    remarks: Optional[str] = None
    accomplished_by: str
    
    model_config = ConfigDict(from_attributes=True)