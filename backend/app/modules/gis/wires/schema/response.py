from pydantic import BaseModel



class ConductorWires(BaseModel):
    id: int
    name: str