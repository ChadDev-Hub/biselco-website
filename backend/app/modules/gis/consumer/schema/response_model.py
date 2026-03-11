from pydantic import BaseModel
from shapely.geometry import mapping
from typing import Optional, List
class location (BaseModel):
    type: str
    coordinates: List[float]

class Consumer(BaseModel):
    account_no: str
    account_name: str
    meter_brand: str
    meter_no: str
    village: str
    municipality: str
    geolocation: Optional[location] | None = None

    class Config:
        orm_mode = True