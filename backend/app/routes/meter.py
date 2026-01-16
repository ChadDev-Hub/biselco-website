from fastapi import APIRouter, HTTPException, status, Depends, Form
from ..dependencies.db_session import get_session
from sqlalchemy.ext.asyncio.session import AsyncSession
from ..models.meters import MeterAccount
from ..utils.token import get_current_user
from sqlalchemy import select
from ..schema.form import CreatMeterAccount
from datetime import datetime, timezone
from sqlalchemy.exc import IntegrityError

router = APIRouter(prefix="/meter", tags=["Electric Meter"])

@router.post("/create")
async def create_meter(
    user:dict = Depends(get_current_user),
    session:AsyncSession = Depends(get_session),
    form: CreatMeterAccount = Form()
    ):
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized Transaction")
    try:
        username = user.get("username")
        user_id = user.get("userid")
        new_meter = MeterAccount(
            account_no = form.accountno,
            user_id = user_id,
            consumer_name = form.consumername,
            consumer_type = form.consumertype,
            meter_location = f"{form.village} | {form.municipality}",
            mobile_no = form.mobileno,
            created_at = datetime.now(timezone.utc),
            is_active = True      
        )
        session.add(new_meter)
        await session.commit()
        await session.close()
        return {
            "status" : "Succesfully Created Meter"
        }
    except IntegrityError as e:
        await session.rollback()
        if "unique constraint" in str(e).lower():
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Account No Already Exists")

@router.post("/get")
async def get_meter_info(user:dict = Depends(get_current_user)):
    if not user:
        return HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized Transaction")