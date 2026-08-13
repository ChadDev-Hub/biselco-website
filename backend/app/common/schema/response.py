from pydantic import BaseModel
from typing import Optional, List


class Geometry(BaseModel):
    type: str
    coordinates: list


class Feature(BaseModel):
    type: str
    geometry: Geometry
    properties: Optional[dict] = None


class FeatureCollection(BaseModel):
    type: str
    features: List[Feature]


class PointCoordinates(BaseModel):
    latitude: float
    longitude: float 
    srid: int


class Stats(BaseModel):
    id: Optional[int]
    name: str
    value: int
    description: str