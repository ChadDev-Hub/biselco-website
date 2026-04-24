from pydantic import BaseModel, ConfigDict
from datetime import date
from typing import Optional
class NewConnectionReportResponse(BaseModel):
    date_accomplished: date
    account_no: Optional[str]
    consumer_name: str
    location:str
    meter_serial_no: str
    meter_brand: str
    meter_sealed: str
    multiplier: int
    initial_reading: int
    accomplished_by: str
    
    
    model_config = ConfigDict(from_attributes=True)


