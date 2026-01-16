from fastapi import APIRouter



router = APIRouter(tags=["Landing Page"])

@router.get("/")
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