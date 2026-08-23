from pydantic import BaseModel



class Wires(BaseModel):
    id: int
    name: str