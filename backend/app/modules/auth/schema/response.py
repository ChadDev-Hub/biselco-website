from pydantic import BaseModel
from datetime import datetime


class AccessToken(BaseModel):
    key: str;
    value: str;
    expires: datetime;
    http_only: bool = True;
    secure: bool = True; 