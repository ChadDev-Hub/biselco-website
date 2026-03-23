from pydantic import BaseModel


class ChangeMeterReport(BaseModel):
    items:set
    prepared_by: str
    prepared_position: str
    checked_by: str
    checked_position: str
    approved_by: str
    approved_position: str