from pydantic import BaseModel, ConfigDict
from datetime import date
from typing import Optional, List
from .....common.schema.response import PointCoordinates, Stats
class NewConnectionReportResponse(BaseModel):
    date_accomplished: date
    account_no: Optional[str] = None 
    consumer_name: str
    location:str
    meter_serial_no: str
    meter_brand: str
    meter_sealed: str
    multiplier: int
    initial_reading: int
    accomplished_by: str
    
    
    model_config = ConfigDict(from_attributes=True)



class NewConnectionData(BaseModel):
    id: int
    date_accomplished: date
    account_no: Optional[str] = None 
    consumer_name: str
    location:str
    meter_serial_no: str
    meter_brand: str
    meter_sealed: str
    initial_reading: int
    multiplier: int
    accomplished_by: str
    remarks: Optional[str] = None
    images: Optional[List[str]] = None
    geom: PointCoordinates
    
    model_config = ConfigDict(from_attributes=True)
class NewConnectionInitialData(BaseModel):
    data: List[NewConnectionData]
    total_page: int
    stats: List[Stats]
    model_config = ConfigDict(from_attributes=True)


class CreatedData(BaseModel):
    new_connection: NewConnectionData
    new_connection_stats: List[Stats]
    model_config = ConfigDict(from_attributes=True)

class NewConnectionCreatedResponse(BaseModel):
    detail: str
    total_page: int
    message: str
    number_of_features: int
    data: CreatedData
    
    model_config = ConfigDict(from_attributes=True)

class NewConnectionDeleteResponse(BaseModel):
    detail: str;
    deleted_id: List[int];
    stats: List[Stats];
    message: str
    
class NewConnectionSyncResponse(BaseModel):
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
    image: Optional[List[str]] = None
    lat: float
    lon: float
    sitio: Optional[str] = None