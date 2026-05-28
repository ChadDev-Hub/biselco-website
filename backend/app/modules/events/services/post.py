from ..model.events import Events
from .get import GetEventServices
from ..schema.requests import AgmaEventSetup
from sqlalchemy.dialects.postgresql import insert
from fastapi import Depends, HTTPException, status
from pprint import pprint
from datetime import date
import re

class PostEventServices:
    def __init__(self, get_services:GetEventServices = Depends(GetEventServices)):
        self.session = get_services.session
    
    
    
    
        
