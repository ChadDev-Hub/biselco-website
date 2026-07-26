from fastapi import HTTPException, APIRouter, status, Depends, Query
from dotenv import load_dotenv
import os


load_dotenv()
BISCOLLECT_SECRET_KEY = os.getengv("BISCOLLECT_SECRET_KEY")



router = APIRouter(
    prefix="/biscollect",
    tags=["biscollect"],
)

@router.post("/validate", status_code=status.HTTP_200_OK)
async def validate_login(secret=Query(...)):
    if not secret:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Secret Key is Required",
        )
    
    