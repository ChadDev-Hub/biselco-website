from pydantic import BaseModel, field_validator
import json
from datetime import date as date_type
from typing import List, Optional
class GeometryType(BaseModel):
    type: str
    coordinates: List[float]

class Properties(BaseModel):
    id: int
    line_type: str
    village: Optional[str] = None
    phasing: str
    pole_assembly: Optional[str] = None
    municipal:  Optional[str] = None
    conductor_wire: Optional[str] = None
    neutral_wire: Optional[str] = None
    date: Optional[date_type] = None
    pct_acc: Optional[float] = None
    image: Optional[str] = None
class Line(BaseModel):
    type: str
    properties: Properties
    geometry: GeometryType
    
    
    
    @field_validator("geometry", mode="before")
    @classmethod
    def validate_geometry(cls, v):
        if isinstance(v, str):
            return json.loads(v)