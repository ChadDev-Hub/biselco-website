from fastapi import APIRouter, Depends,status
from ..utils.token import get_current_user


router = APIRouter(tags=["Landing Page"])

@router.get("/", status_code=status.HTTP_200_OK)
async def landing_page():
        return{
                "hero" : {
                    "title": "BISELCO",
                    "subtitle": "Busuanga Island Electric Cooperative,Inc.",
                    "description" : """Providing reliable electricity distribution across
                    the Calamianes Islands, 
                    powering communities and supporting sustainable development.
                    """
                    } 
            }