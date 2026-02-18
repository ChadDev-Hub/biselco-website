from pydantic import BaseModel


class CreateMeterAccount(BaseModel):
    account_number: str
    consumer_name: str
    consumer_type: str
    village: str
    municipality: str
    mobileno: str