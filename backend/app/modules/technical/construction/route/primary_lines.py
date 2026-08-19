from sqlalchemy import select, func, or_, cast, Text
from fastapi import APIRouter, HTTPException, status



router = APIRouter(prefix="/construction/primary_lines", tags=["Primary Lines"])


router.post("", status_code=status.HTTP_201_CREATED)
async def construct_primary_lines():
    pass
    