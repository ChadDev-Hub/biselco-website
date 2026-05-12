from pydantic import BaseModel, ConfigDict
from geoalchemy2 import Geometry
from geoalchemy2.elements import WKTElement
from geoalchemy2.functions import ST_Point
from typing import Optional


class SelectedLocation(BaseModel):
    location:str
    
    
class VerifiedLocation(BaseModel):
    village:str
    municipality:str
    geom: WKTElement
    lat: Optional[float] = None
    lon: Optional[float] = None
    model_config = ConfigDict(arbitrary_types_allowed=True)