from pydantic import BaseModel
from typing import Optional
from datetime import date, time, datetime
from typing import List



class AgmaSetup(BaseModel):
    id: int
    title:str
    description:str
    start_date:Optional[date] = None
    end_date: Optional[date] = None
    start_time: Optional[time] = None
    end_time: Optional[time] = None
    is_active: Optional[bool] = None
    
class AgmaCountRegistered(BaseModel):
    name: Optional[str] = None
    value: Optional[int] = None

class RegisteredOvertime(BaseModel):
    name: Optional[str] = None
    coron: Optional[int] = None
    culion: Optional[int] = None
    busuanga: Optional[int] = None
    linapacan: Optional[int] = None

class AgmaStats(BaseModel):
    title: str
    value:  float | int | str | None = None
    description: Optional[str] = None
    is_percentage: Optional[bool] = None

class AgmaSpin(BaseModel):
    entries: List[str];
    pending_winner: str;
    pending_winner_idx: int;
    
    
class WinnerInfo(BaseModel):
    id: str
    account_no: str
    name: str
    image: str
    village: str
    municipality: str

class CountItem(BaseModel):
    name: str
    value: int

class RaffleStats(BaseModel):
    w_per_mun: List[CountItem]
    w_per_vill: List[CountItem]


class User(BaseModel):
    id: str
    first_name: str
    last_name: str
    photo: str
    
class Monitoring(BaseModel):
    id: str
    comment: str
    date: str
    time: str
    comment: str
    user: User

class RegisteredConsumer(BaseModel):
    id: str
    account_no: str
    account_name: str
    image: str
    phone: Optional[str] = None
    signature: str
    village: Optional[str] = None
    municipality: Optional[str] = None
    meter_no: Optional[str] = None
    meter_brand: Optional[str] = None
    date_registered: str
    time_registered: str
    is_verified: Optional[bool] = None
    year: str
    sample_bill: Optional[str] = None
    authorization_letter: Optional[str] = None
    monitoring: Optional[List[Monitoring]] = None
    
class RegisteredConsumerAll(BaseModel):
    data: Optional[List[RegisteredConsumer]] = None
    total_page: Optional[int] = None
    
class VerificationClass(BaseModel):
    id: str;
    is_verified: bool
    monitoring: Optional[List[Monitoring]]