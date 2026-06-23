from pydantic import BaseModel
from fastapi import UploadFile
from typing import Optional


class VerificationRequest(BaseModel):
    id: str
    is_verified: bool

class AgmaRegistrationRequest(BaseModel):
    account_no: str
    name: str 
    mobile_no: Optional[str] = None
    image:UploadFile
    signature:UploadFile
    sample_bill:Optional[UploadFile] = None
    authorization_letter:Optional[UploadFile] = None


class AgmaValidationRequest(BaseModel):
    account_no: str
    name: str
    mobile_no: str
    image_url: str
    signature_url: str
    authorization_letter_url: Optional[str] = None
    
    
class AccountNumberRequest(BaseModel):
    account_no: str
    
    
class Registeredid(BaseModel):
    id: str