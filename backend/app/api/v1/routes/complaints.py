from fastapi import APIRouter, status, Depends, Form, Body, Query, File, UploadFile
from fastapi.exceptions import HTTPException
from sqlalchemy import select, asc, desc, delete, and_, update
from sqlalchemy.orm import selectinload
from ....dependencies.db_session import get_session
from ....core.security import get_current_user, get_current_user_ws
from ....modules.complaints.schema.requests_model import ComplaintsStatus
from sqlalchemy.ext.asyncio.session import AsyncSession
from geoalchemy2.functions import ST_Point, ST_SetSRID, ST_Intersects
from shapely.geometry import Point
from ....modules.complaints.services.get_complaints import complaints, new_complaint, user_complaints, new_complaints_status
from ....modules.complaints.services.complaints_dashboard import get_complaints_history, get_top_10_complaints, get_complaint_overtime
from geoalchemy2.shape import to_shape
from datetime import date, datetime
from ....modules.websocket.websocket_manager import manager
from ....modules.complaints import *
from ....modules.user import Users, Roles
from sqlalchemy.dialects.postgresql import UUID
from ....modules.complaints.schema.response_model import ComplaintsModel, ComplaintStatusName, ComplaintsModelLists, NewComplaintsModel
from ....modules.user.schema.response_model import UserModel
from typing import Optional
from ....modules.gis.franchise_area.model.boundary import Boundary
from ....modules.gis.consumer.model.consumer import ConsumerMeter
from ....modules.gis.franchise_area.services.get_location import verifyLocation
from ....modules.gis.franchise_area.schema.response_model import VerifiedLocation
from ....modules.complaints.services.complaints_status_history import add_complaints_history
from ....modules.complaints.services.complaints_messages import get_message
from ....modules.websocket.schema.response_model import Message
from ....modules.complaints.services.complaints_stats import get_complaints_stats
from ....modules.complaints.schema.response_model import Stat
from ....modules.complaints.model.complaint_image import ComplaintsImage
from asyncio import gather
from typing import List
from ....dependencies.bucket3 import upload_image
# ROUTER INITIALIZATION
router = APIRouter(prefix="/complaints", tags=["Complaints"])


# GET ALL COMPLAINTS FOR SPECIFIC USER
@router.get("/", status_code=status.HTTP_200_OK, response_model=list[ComplaintsModel])
async def get_user_complaints(user: UserModel = Depends(get_current_user), session: AsyncSession = Depends(get_session)):
    complaint = await user_complaints(session=session, user_id=user.id)
    return complaint

# GET ALL COMPLAINTS


@router.get("/all", status_code=status.HTTP_200_OK, response_model=ComplaintsModelLists)
async def get_all_complaint(
        q: Optional[str] = Query(None),
        page: Optional[int] = Query(None),
        session: AsyncSession = Depends(get_session),
        user: UserModel = Depends(get_current_user)):
    current_user = (await session.execute(select(Users)
                                          .options(selectinload(Users.roles))
                                          .where(Users.id == str(user.id)))).scalar_one_or_none()
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User Not Found")
    if "admin" not in [role.name.lower() for role in current_user.roles]:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Admin Only Transaction Allowed")
    return await complaints(session=session, query=q, page=page, user_id= str(user.id))


# GET ALL COMPLAINTS STATUS NAME
@router.get("/status/name", status_code=status.HTTP_200_OK, response_model=list[ComplaintStatusName])
async def get_complaints_status_name(session: AsyncSession = Depends(get_session)):
    status_name = (await session.execute(select(ComplaintsStatusName).order_by(desc(ComplaintsStatusName.id)))).scalars().all()
    return status_name

# CREATE COMPLAINTS ON SPECIFIC USER  (METER)


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_complaints(
    user: UserModel = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
    accountNumber: str = Form(...),
    issue: str = Form(...),
    details: str = Form(...),
    lon: str = Form(...),
    lat: str = Form(...),
    attachment: Optional[UploadFile] = File(None)
):
    uploaded_url = None
    if attachment:
        uploaded_url = await upload_image(file=attachment, folder="complaints")
        
    geom = ST_SetSRID(ST_Point(float(lon), float(lat)), 4326)
    # VERIFY COMPLAINTS LOCATION
    location = (await session.execute(select(Boundary)
                                      .options(
        selectinload(Boundary.villages),
        selectinload(Boundary.municipal)
    )
        .where(ST_Intersects(Boundary.geom, geom)).order_by(desc(Boundary.id)).limit(1))).scalar_one_or_none()

    # LIMIT COMPLAINTS LOCATION ON FRANCHISE AREA ONLY
    if not location:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail="Complaint location Exceeds Franchise Area")

    # GET RECEIVED COMPLAINTS
    received = (await session.execute(
        select(ComplaintsStatusName).where(ComplaintsStatusName.status_name == "Received"))
    ).scalars().first()
    if not received:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Complaints Status Not Found")

    # VERIFY CONSUMER ACCOUNT
    account = (await session.execute(
        select(ConsumerMeter)
        .where(ConsumerMeter.account_no == accountNumber)
    )).scalar_one_or_none()
    if account:
        # COMPLAINT DESCRIPTION
        description = f"""
        Account Number: {account.account_no}\n
        Consumer Name: {account.account_name}\n
        Meter Number: {account.meter_no}\n
        Meter Brand: {account.meter_brand}\n\n
        Details: {details}"""
    else:
        description = f"""
        Account Number: {accountNumber}\n\n
        Details: {details}"""

    # CREATE COMPLAINT
    new_complaints = Complaints(
        subject=issue.upper(),
        description=description,
        reference_pole="Pole1",
        location=geom,
        village=location.villages.name,
        municipality=location.municipal.name,
        user_id=user.id,
    )
    # COMPLAINT STATUS UPDATE
    status_updates = ComplaintsStatusUpdates(
        status=received)
    new_complaints.status_updates.append(status_updates)
    
    # ADD COMPLAINTS IMAGE
    if uploaded_url: 
        image = ComplaintsImage(
            image_url=uploaded_url
        )
        new_complaints.complaints_image.append(image)
    session.add(new_complaints)
    await session.commit()
    await session.refresh(new_complaints, attribute_names=["user", "status_updates"])

    # QUERY THE LATEST COMPLAINT
    data = await new_complaint(session=session, complaint_id=new_complaints.id, user_id=str(user.id))
    new_complaint_data = {
        "detail": "complaints",
        "data": NewComplaintsModel(**data).model_dump()}
    # SEND TO SPECIFIC  CLIENT
    await manager.broad_cast_personal_json(user_id=str(user.id), data=new_complaint_data)
    new_complaint_data_admin = {
        "detail": "complaints_admin",
        "data": NewComplaintsModel(**data).model_dump()}
    new_complaint_stats = {
        "detail": "complaints_stats",
        "data": await get_complaints_stats(session=session)
    }
    # ADMIN USER
    admins = (await session.execute(select(Roles).options(selectinload(Roles.users)).where(Roles.name == "admin"))).scalars().all()
    admin_ids = [str(us.id) for admin in admins for us in admin.users]

    for admin_id in admin_ids:
        await manager.broad_cast_personal_json(
            user_id=admin_id, data=new_complaint_data_admin)
        await manager.broad_cast_personal_json(
            user_id=admin_id, data=new_complaint_stats)

    return {
        "detail": "Complaints Submitted"
    }


# CREATE COMPLAINT ON SPECIFIC USER GENERIC COMPLAINTS'


@router.post("/generic", status_code=status.HTTP_201_CREATED)
async def create_generic_complaints(
    user: UserModel = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
    issue: str = Form(...),
    details: str = Form(...),
    location: VerifiedLocation = Depends(verifyLocation),
    attachment: Optional[UploadFile] = File(None)
):
    # UPLOAD IMAGE
    uploaded_url = None
    if attachment:
        uploaded_url = await upload_image(file=attachment, folder="complaints")
    # GET RECIEVED COMPLAINTS
    received = (await session.execute(
        select(ComplaintsStatusName).where(ComplaintsStatusName.status_name == "Received"))
    ).scalars().first()
    
    if not received:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Complaints Status Not Found")

    status_updates = ComplaintsStatusUpdates(
        status=received)

    # COMPLAINT DESCRIPTION
    description = f"""
    Details: {details}"""

    # CREATE COMPLAINT
    new_complaints = Complaints(
        subject=issue.upper(),
        description=description,
        reference_pole="Pole1",
        location=location.geom,
        village=location.village,
        municipality=location.municipality,
        user_id=user.id

    )
    new_complaints.status_updates.append(status_updates)
    session.add(new_complaints)
    
    # ADD COMPLAINTS IMAGE
    if uploaded_url: 
        image = ComplaintsImage(
            image_url=uploaded_url
        )
        new_complaints.complaints_image.append(image)
    await session.commit()
    await session.refresh(new_complaints, attribute_names=["user", "status_updates"])

    # QUERY THE LATEST COMPLAINT
    data = await new_complaint(session=session, complaint_id=new_complaints.id, user_id=str(user.id))

    json_data = {
        "detail": "complaints",
        "data": NewComplaintsModel(**data).model_dump()}

    # SEND TO SPECIFIC  CLIENT
    await manager.broad_cast_personal_json(user_id=str(user.id), data=json_data)

    new_complaints_admin = {
        "detail": "complaints_admin",
        "data": NewComplaintsModel(**data).model_dump()}
    new_complaints_stat = {
        "detail": "complaints_stats",
        "data": await get_complaints_stats(session=session)
    }
    # ADMIN USER
    admins = (await session.execute(select(Roles).options(selectinload(Roles.users)).where(Roles.name == "admin"))).scalars().all()
    admin_ids = [str(user.id)
                 for admin_user in admins for user in admin_user.users]
   
    for admin_id in admin_ids:
        await manager.broad_cast_personal_json(
            user_id=admin_id, data=new_complaints_admin)
        await manager.broad_cast_personal_json(
            user_id=admin_id, data=new_complaints_stat)
  

    return {
        "detail": "Complaints Submitted"
    }


# DELETE COMPLAINT


@router.delete("/{complaint_id}", status_code=status.HTTP_200_OK)
async def delete_complaint(
        complaint_id: int,
        session: AsyncSession = Depends(get_session),
        user: UserModel = Depends(get_current_user)):
    try:
        select_stmt = select(Complaints).where(Complaints.id == complaint_id)
        data = (await session.execute(select_stmt)).scalar_one_or_none()
        if not data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Complaint Not Found")
        # DELETED COMPLAINTS DATA
        deleted_complaint = {
            "id": data.id,
            "subject": data.subject,
            "description": data.description,
            "reference_pole": data.reference_pole,
            "location": {
                'latitude': Point(to_shape(data.location).coords).y,
                'longitude': Point(to_shape(data.location).coords).x,
            },
            "village": data.village,
            "municipality": data.municipality
        }
        delete_stmt = (
            update(Complaints)
            .where(Complaints.id == complaint_id)
            .values({"is_deleted": True,
                     "deleted_at": datetime.now()}))
        await session.execute(delete_stmt)
        await session.commit()
        admins = (await session.execute(select(Roles).options(selectinload(Roles.users)).where(Roles.name == "admin"))).scalars().all()
        admin_ids = [str(user.id)
                     for admin_user in admins for user in admin_user.users]

        if str(user.id) not in admin_ids:
            admin_ids.append(str(user.id))
        deleted = {
            "detail": "deleted_complaints",
            "data": deleted_complaint,
        }
        new_complaints_stat = {
            "detail": "complaints_stats",
            "data": await get_complaints_stats(session=session)
        }

        for admin in admin_ids:
            await manager.broad_cast_personal_json(
                user_id=admin, data=deleted)
            await manager.broad_cast_personal_json(
                user_id=admin, data=new_complaints_stat)
        

    except Exception as e:
        return e
    return {
        "detail": "Successfully Deleted"
    }

# UPDATE COMPLAINT STATUS


@router.put("/status/{complaint_id}", status_code=status.HTTP_201_CREATED)
async def update_complaint_status(
        complaint_id: int,
        data: ComplaintsStatus = Body(),
        session: AsyncSession = Depends(get_session),
        user: UserModel = Depends(get_current_user)):

    if "admin" not in [role.name for role in user.roles]:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Admin Only Transaction Allowed")
    try:
        select_complaint = (await session.execute(select(Complaints).where(Complaints.id == complaint_id))).scalar_one_or_none()
        if not select_complaint:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Complaint Not Found")
        select_status = (await session.execute(select(ComplaintsStatusName).where(ComplaintsStatusName.status_name == data.status_name))).scalar_one_or_none()
        if not select_status:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Status Not Found")

        # ADD NEW STATUS
        new_status = ComplaintsStatusUpdates(
            complaints=select_complaint,
            status=select_status
        )
        session.add(new_status)
        await session.commit()
        await session.refresh(select_complaint)

        # ADD STATUS HISTORY
        data_history = {
            "complaint_id": select_complaint.id,
            "status_id": select_status.id,
            "user_id": user.id,
            "comments": f"Updated to {data.status_name}",
            "timestamped": datetime.now()
        }
        await add_complaints_history(session=session, data=data_history)

        # SEND TO ADMIN AND TO SPECIFIC CLIENT
        # ADMINS
        admins = (await session.execute(select(Roles).options(selectinload(Roles.users)).where(Roles.name == "admin"))).scalars().all()
        admin_ids = [str(user.id)
                     for admin_user in admins for user in admin_user.users]

        # APPEND USER ID IF IT IS NOT IN ADMIN
        if str(select_complaint.user_id) not in admin_ids:
            admin_ids.append(str(select_complaint.user_id))
        new_complaint_status = {
            "detail": "complaint_status",
            "data": await new_complaints_status(session=session, complaint_id=complaint_id, user_id=str(user.id))
        }
        new_stats = {
            "detail": "complaint_stats",
            "data": await get_complaints_stats(session=session)
        }

        # BROAD CAST NEW UPDATED DATA TO ALL ADMINS AND SPECIFIC CLIENT
        for admin in admin_ids:
            await manager.broad_cast_personal_json(
                user_id=admin, data=new_stats)
            await manager.broad_cast_personal_json(
                user_id=admin, data=new_complaint_status)
            

    except Exception as e:
        return e
    return {
        "detail": f"{data.status_name} Successfully Updated"
    }


# DELETE STATUS
@router.delete("/status/{complaint_id}", status_code=status.HTTP_200_OK)
async def delete_complaint_status(
    complaint_id: int,
    session: AsyncSession = Depends(get_session),
    data: ComplaintsStatus = Body(),
    user: UserModel = Depends(get_current_user),
):

    if "admin" not in [role.name for role in user.roles]:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Admin Only Transaction Allowed")
    try:
        select_complaint = (await session.execute(select(Complaints).where(Complaints.id == complaint_id))).scalar_one_or_none()
        if not select_complaint:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Complaint Not Found")
        select_status = (await session.execute(select(ComplaintsStatusName).where(ComplaintsStatusName.status_name == data.status_name))).scalar_one_or_none()
        if not select_status:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Status Not Found")

        # DELETE STATEMENT
        delete_stmt = delete(ComplaintsStatusUpdates).where(
            and_(
                ComplaintsStatusUpdates.complaints == select_complaint,
                ComplaintsStatusUpdates.status == select_status)
        )
        await session.execute(delete_stmt)
        await session.commit()
        await session.refresh(select_complaint)

        # ADD STATUS HISTORY
        data_history = {
            "complaint_id": select_complaint.id,
            "status_id": select_status.id,
            "user_id": user.id,
            "comments": f"Removed from {data.status_name}",
            "timestamped": datetime.now()
        }
        await add_complaints_history(session=session, data=data_history)

        # BROADCAST
        admin = (await session.execute(select(Roles).options(selectinload(Roles.users)).where(Roles.name == "admin"))).scalars().all()
        admin_ids = [str(user.id)
                     for admin_user in admin for user in admin_user.users]
        
    
        
        # APPEND USER ID IF IT IS NOT IN ADMIN
        if str(select_complaint.user_id) not in admin_ids:
            admin_ids.append(str(select_complaint.user_id))

        # TASK
        new_status = {
            "detail": "complaint_status",
            "data": await new_complaints_status(session=session, complaint_id=complaint_id, user_id=str(user.id))
        }
        new_stats = {
            "detail": "complaint_stats",
            "data": await get_complaints_stats(session=session)
        }
     
        
        # BROAD CAST NEW UPDATED DATA TO ALL ADMINS AND SPECIFIC CLIENT
        for admin in admin_ids:
            await manager.broad_cast_personal_json(
                user_id=admin, data=new_stats)
            await manager.broad_cast_personal_json(
                user_id=admin, data=new_status)
            
        
        
    except Exception as e:
        return e
    return {
        "detail": f"{data.status_name} Successfully Updated"
    }


# Complaints Message
@router.get("/message", status_code=status.HTTP_200_OK, response_model=list[Message])
async def get_complaints_message(session: AsyncSession = Depends(get_session), complaints_id: int = Query(...)):
    return await get_message(session=session, complaints_id=complaints_id)


# Complaints Stats
@router.get("/stats", status_code=status.HTTP_200_OK, response_model=List[Stat])
async def complaints_stats(session: AsyncSession = Depends(get_session)):
    return await get_complaints_stats(session=session)


# COMPLAINTS HISTORY INCLUDES DELETED COMPLAINTS
@router.get("/history", status_code=status.HTTP_200_OK)
async def get_history(session: AsyncSession = Depends(get_session)):
    return await get_complaints_history(session=session)


@router.get("/top", status_code=status.HTTP_200_OK)
async def get_top_complaints(session: AsyncSession = Depends(get_session)):
    return await get_top_10_complaints(session=session)

@router.get("/overtime", status_code=status.HTTP_200_OK)
async def complaint_overtime(session: AsyncSession = Depends(get_session)):
    return await get_complaint_overtime(session=session)