from pydantic import BaseModel

# NEWS MODEL
class CreateNews(BaseModel):
    title:str
    description:str