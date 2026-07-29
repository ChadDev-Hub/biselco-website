from pydantic import BaseModel



class LandingPageHeroInformation(BaseModel):
    title: str
    subtitle: str
    description: str
    badge: str
    qoute: str