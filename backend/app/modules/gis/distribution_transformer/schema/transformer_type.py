from pydantic import BaseModel


class TransformerType(BaseModel):
    id: int
    name: str
    