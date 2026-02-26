from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio.session import AsyncSession
from sqlalchemy.orm import selectinload
from .. import *
from shapely.geometry import Point
from geoalchemy2.shape import to_shape
from uuid import UUID
from ...departments.model.departments import Departments
from ..model.form import CompanyForm
from ...technical.model.consumer_meter import NewConnection, ChangeMeter

async def get_technical_forms(session:AsyncSession):
    tech_dep = (await session.execute(select(Departments).where(Departments.name == "TSD"))).scalar_one_or_none()
    if not tech_dep:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Department Not Found")
    department_id = tech_dep.id
    forms = (await session.execute(
        select(CompanyForm)
        .options(selectinload(CompanyForm.change_meters))
        .options(selectinload(CompanyForm.new_connections))
        .where(CompanyForm.department_id == department_id)
    )).scalars().all()
    change_meter_columns = NewConnection.__table__.columns.keys()
    new_connection_columns = ChangeMeter.__table__.columns.keys()
    
    data = [
        {
            "id": form.id,
            "form_name": form.form_name,
            "form_description": form.form_description,
            "form_inputs": change_meter_columns if form.form_name == "Change Meter" else new_connection_columns,
        }
        for form in forms
    ]
    
    return data





