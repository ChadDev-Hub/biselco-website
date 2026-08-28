from sqlalchemy import select, func, or_, cast, Text
from ..schema.requests import NewPrimaryLine
from fastapi import APIRouter, HTTPException, status, Form, Depends
from typing import List
from ..services.post import PostServices

router = APIRouter(prefix="/construction/primary_lines", tags=["Primary Lines"])


@router.post("/sync", status_code=status.HTTP_201_CREATED)
async def construct_primary_lines(
    data: NewPrimaryLine = Form(...),
    post_service:PostServices = Depends(PostServices), 
    
):
    """
    It will get data from the request Body. 
    Args:
        data (NewPrimaryLine): New Construction Primary Line Includes the following fields:
            - activity: Literal["Line Construction"] = "Line Construction"
            - date_accomplished:date
            - type: Literal['Line Extension', 'New Line']
            - line_type: Literal['Primary', 'Secondary', 'Underbuilt']
            - phasing: str
            - pole_assembly: Optional[str] = None
            - conductor: str
            - neutral: Optional[str]
            - lat: float
            - lon: float
            - image: UploadFile
    """
    
    res = await post_service.synced_line_construciton(data=data)
    
    return res