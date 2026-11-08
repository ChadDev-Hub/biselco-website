from pydantic import BaseModel, field_validator
from .line_construction import Line
from typing import List,Optional, Generic, TypeVar
from datetime import date
from .manpower import Manpower

import json

T = TypeVar("T", bound=BaseModel)
class FeatureCollection(BaseModel,Generic[T]):
    type: str
    features: List[T]

class Feature(BaseModel):
    type: str
    coordinates: List[float]

class Constructions(BaseModel,Generic[T]):
    id: int
    activity: str
    description: str
    date_accomplished: date
    centroid:Optional[Feature] = None
    feature_collection: FeatureCollection[T]
    
    @field_validator("centroid", mode="before")
    @classmethod
    def validate_centroid(cls, v):
        if isinstance(v, str):
            return json.loads(v)
        
class LineConstruction(BaseModel):
    construction: Constructions[Line]
    
    
