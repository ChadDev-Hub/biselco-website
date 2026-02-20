from pydantic import BaseModel
from typing import List, Optional

# NEWS MODEL
class UserModel(BaseModel):
    user_name: str
    first_name: str
    last_name: str
    photo: str

class NewsModel(BaseModel):
    id: int
    title: str
    description: str
    date_posted: str
    time_posted: str
    period: str
    user: UserModel
    images: Optional[list | str]




