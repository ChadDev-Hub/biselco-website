from pydantic import BaseModel
from typing import Literal, Optional, List
from fastapi import UploadFile

class NewPrimaryLine(BaseModel):
    activity: Literal["line construction"] = "Line Construction"
    type: Literal['Line Extension', 'New Line']
    line_type: Literal['Primary', 'Secondary', 'Underbuilt']
    phasing: str
    pole_assembly: str
    conductor: str
    neutral: Optional[str]
    lat: float
    lon: float
    image: UploadFile