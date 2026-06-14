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
