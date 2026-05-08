from pydantic import BaseModel
from fastapi import UploadFile

class AgmaRegistrationRequest(BaseModel):
    account_no: str
    name: str 
    mobile_no: str
    image:UploadFile
    signature:UploadFile


class AgmaValidationRequest(BaseModel):
    account_no: str
    name: str
    mobile_no: str
    image_url: str
    signature_url: str