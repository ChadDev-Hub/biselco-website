from fastapi import APIRouter, Depends
from ..utils.token import get_current_user
router = APIRouter(prefix="/news", tags=["News"])



@router.get("/")
async def get_news(current_user = Depends(get_current_user)):
    return {
        "news" : "Hello World"
    }