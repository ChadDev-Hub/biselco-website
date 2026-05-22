from pydantic import BaseModel, ConfigDict
from typing import List

class AbrevationStyle(BaseModel):
    char: str
    color: str
    model_config = ConfigDict(from_attributes=True)
class AgmaEvent(BaseModel):
    id: int
    title: str
    description: str
    date_end: float
    qoute_title: str
    qoute_description: str
    footer: str
    image_src: str
    abrevation: List[AbrevationStyle]
    model_config = ConfigDict(from_attributes=True)
    
