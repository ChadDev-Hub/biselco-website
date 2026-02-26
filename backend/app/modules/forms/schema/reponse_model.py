from pydantic import BaseModel



class CompanyFormsResponse(BaseModel):
    id: int
    form_name: str
    form_description: str
    form_inputs: list