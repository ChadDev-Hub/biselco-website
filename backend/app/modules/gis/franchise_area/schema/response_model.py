from pydantic import BaseModel, ConfigDict
from geoalchemy2 import Geometry
from geoalchemy2.elements import WKTElement
from geoalchemy2.functions import ST_Point
from typing import Optional


class SelectedLocation(BaseModel):
    location:str
    
    
class VerifiedLocation(BaseModel):
    village_id:int
    municipal_id: int
    village:str
    municipality:str
    geom: WKTElement
    model_config = ConfigDict(arbitrary_types_allowed=True)