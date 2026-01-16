from typing import Annotated
from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from ..dependencies.auth import oauth2_scheme

router = APIRouter(prefix="/users", tags=["Users"])

