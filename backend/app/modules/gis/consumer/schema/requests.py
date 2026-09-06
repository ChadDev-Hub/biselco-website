from pydantic import BaseModel
from typing import Optional, List


class ConsumerHashed(BaseModel):
    hashed: Optional[List[str]]