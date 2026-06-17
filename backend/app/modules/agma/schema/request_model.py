from pydantic import BaseModel
from fastapi import UploadFile
from typing import Optional
class AgmaRegistrationRequest(BaseModel):
    account_no: str
    name: str 
    mobile_no: str
    image:UploadFile
    signature:UploadFile
    sample_bill:UploadFile
    authorization_letter:Optional[UploadFile] = None


class AgmaValidationRequest(BaseModel):
    account_no: str
    name: str
    mobile_no: str
    image_url: str
    signature_url: str
    authorization_letter_url: str
    
    
class AccountNumberRequest(BaseModel):
    account_no: str
    
    
class Registeredid(BaseModel):
    id: str