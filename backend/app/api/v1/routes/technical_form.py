from fastapi import APIRouter, HTTPException, status, Depends
from ....dependencies.db_session import get_session
from sqlalchemy.ext.asyncio.session import AsyncSession
from ....modules.forms.service.get_technical_forms import get_technical_forms
from ....modules.forms.schema.reponse_model import CompanyFormsResponse
from typing import List
router = APIRouter(prefix="/technical_form", tags=["Technical Department"])


# GET ALL TECHNICAL FORMS
@router.get("/all", status_code=status.HTTP_200_OK, response_model=List[CompanyFormsResponse])
async def get_all_technical_form(session:AsyncSession = Depends(get_session)):
    return await get_technical_forms(session=session)