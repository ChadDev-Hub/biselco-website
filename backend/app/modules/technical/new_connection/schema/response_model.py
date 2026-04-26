from pydantic import BaseModel, ConfigDict
from datetime import date
from typing import Optional, List
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


class GeometryType (BaseModel):
    type: str
    coordinates: List[float]
    srid: int
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
    geom: GeometryType
    
    model_config = ConfigDict(from_attributes=True)
class NewConnectionInitialData(BaseModel):
    data: List[NewConnectionData]
    total_page: int
    model_config = ConfigDict(from_attributes=True)

class NewConnectionStatsResponse(BaseModel):
    label: str
    value: int
    description: str
    
    model_config = ConfigDict(from_attributes=True)


class CreatedData(BaseModel):
    new_connection: NewConnectionData
    new_connection_stats: List[NewConnectionStatsResponse]
    model_config = ConfigDict(from_attributes=True)

class NewConnectionCreatedResponse(BaseModel):
    detail: str
    total_page: int
    message: str
    data: CreatedData
    
    model_config = ConfigDict(from_attributes=True)
    
