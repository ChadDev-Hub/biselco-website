from fastapi import APIRouter, status, Depends, Form, Body, Query, File, UploadFile
from fastapi.exceptions import HTTPException
from sqlalchemy import select, asc, desc, delete, and_, update
from sqlalchemy.orm import selectinload
from ....dependencies.db_session import get_session
from ....core.security import get_current_user, get_current_user_ws
from ..schema.requests_model import ComplaintsStatus
from sqlalchemy.ext.asyncio.session import AsyncSession
from geoalchemy2.functions import ST_Point, ST_SetSRID, ST_Intersects
from shapely.geometry import Point
from ..services.complaints_dashboard import get_complaints_history, get_top_10_complaints, get_complaint_overtime
from geoalchemy2.shape import to_shape
from datetime import date, datetime
from ...websocket.websocket_manager import manager
from .. import *
from ...user import Users, Roles
from sqlalchemy.dialects.postgresql import UUID
from ..schema.response_model import ComplaintsModel, ComplaintStatusName, ComplaintsModelLists, NewComplaintsModel
from ...user.schema.response_model import UserModel
from typing import Optional
from ...gis.franchise_area.model.boundary import Boundary
from ...gis.consumer.model.consumer import ConsumerMeter
from ...gis.franchise_area.services.get_location import verifyLocation
from ...gis.franchise_area.schema.response_model import VerifiedLocation
from ..services.complaints_status_history import add_complaints_history
from ..services.complaints_messages import get_message
from ...websocket.schema.response_model import Message
from ..services.complaints_stats import get_complaints_stats
from ..schema.response_model import Stat
from ..model.complaint_image import ComplaintsImage
from asyncio import gather
from typing import List
from ..services.get2 import GetServices, GetDashboardServices, GetMessageServices
from ....dependencies.bucket3 import upload_image
from ..services.put import PutServices
from ..schema.requests_model import Datahistory
from ...user.service.get_user import GetUserServices
# ROUTER INITIALIZATION
router = APIRouter(prefix="/complaints", tags=["Complaints"])


# GET ALL COMPLAINTS FOR SPECIFIC USER
@router.get("/", status_code=status.HTTP_200_OK, response_model=ComplaintsModelLists)
async def get_user_complaints(user: UserModel = Depends(get_current_user), get_service: GetServices = Depends(GetServices)):
    complaint = await get_service.get_all_complaints(get_all=False)
    return complaint

# GET ALL COMPLAINTS
@router.get("/all", status_code=status.HTTP_200_OK, response_model=ComplaintsModelLists)
async def get_all_complaint(
        q: Optional[str] = Query(None),
        page: Optional[int] = Query(None),
        get_services: GetServices = Depends(GetServices),
        user: UserModel = Depends(get_current_user)):
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User Not Found")
    if "admin" not in [role.name.lower() for role in user.roles]:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Admin Only Transaction Allowed")
    data = await get_services.get_all_complaints(query=q, page=page)
    return data


# GET ALL COMPLAINTS STATUS NAME
@router.get("/status/name", status_code=status.HTTP_200_OK, response_model=list[ComplaintStatusName])
async def get_complaints_status_name(session: AsyncSession = Depends(get_session)):
    status_name = (await session.execute(select(ComplaintsStatusName).order_by(desc(ComplaintsStatusName.id)))).scalars().all()
    return status_name

# # CREATE COMPLAINTS ON SPECIFIC USER  (METER)
# @router.post("/", status_code=status.HTTP_201_CREATED)
# async def create_complaints(
#     user: UserModel = Depends(get_current_user),
#     session: AsyncSession = Depends(get_session),
#     accountNumber: str = Form(...),
#     issue: str = Form(...),
#     details: str = Form(...),
#     lon: str = Form(...),
#     lat: str = Form(...),
#     attachment: Optional[UploadFile] = File(None)
# ):
#     uploaded_url = None
#     if attachment:
#         uploaded_url = await upload_image(file=attachment, folder="complaints")
        
#     geom = ST_SetSRID(ST_Point(float(lon), float(lat)), 4326)
#     # VERIFY COMPLAINTS LOCATION
#     location = (await session.execute(select(Boundary)
#                                       .options(
#         selectinload(Boundary.villages),
#         selectinload(Boundary.municipal)
#     )
#         .where(ST_Intersects(Boundary.geom, geom)).order_by(desc(Boundary.id)).limit(1))).scalar_one_or_none()

#     # LIMIT COMPLAINTS LOCATION ON FRANCHISE AREA ONLY
#     if not location:
#         raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
#                             detail="Complaint location Exceeds Franchise Area")

#     # GET RECEIVED COMPLAINTS
#     received = (await session.execute(
#         select(ComplaintsStatusName).where(ComplaintsStatusName.status_name == "Received"))
#     ).scalars().first()
#     if not received:
#         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
#                             detail="Complaints Status Not Found")

#     # VERIFY CONSUMER ACCOUNT
#     account = (await session.execute(
#         select(ConsumerMeter)
#         .where(ConsumerMeter.account_no == accountNumber)
#     )).scalar_one_or_none()
#     if account:
#         # COMPLAINT DESCRIPTION
#         description = f"""
#         Account Number: {account.account_no}\n
#         Consumer Name: {account.account_name}\n
#         Meter Number: {account.meter_no}\n
#         Meter Brand: {account.meter_brand}\n\n
#         Details: {details}"""
#     else:
#         description = f"""
#         Account Number: {accountNumber}\n\n
#         Details: {details}"""

#     # CREATE COMPLAINT
#     new_complaints = Complaints(
#         subject=issue.upper(),
#         description=description,
#         reference_pole="Pole1",
#         location=geom,
#         village=location.villages.name,
#         municipality=location.municipal.name,
#         user_id=user.id,
#     )
#     # COMPLAINT STATUS UPDATE
#     status_updates = ComplaintsStatusUpdates(
#         status=received)
#     new_complaints.status_updates.append(status_updates)
    
#     # ADD COMPLAINTS IMAGE
#     if uploaded_url: 
#         image = ComplaintsImage(
#             image_url=uploaded_url
#         )
#         new_complaints.complaints_image.append(image)
#     session.add(new_complaints)
#     await session.commit()
#     await session.refresh(new_complaints, attribute_names=["user", "status_updates"])

#     # QUERY THE LATEST COMPLAINT
#     data = await new_complaint(session=session, complaint_id=new_complaints.id, user_id=str(user.id))
#     new_complaint_data = {
#         "detail": "complaints",
#         "data": NewComplaintsModel(**data).model_dump()}
#     # SEND TO SPECIFIC  CLIENT
#     await manager.broad_cast_personal_json(user_id=str(user.id), data=new_complaint_data)
#     new_complaint_data_admin = {
#         "detail": "complaints_admin",
#         "data": NewComplaintsModel(**data).model_dump()}
#     new_complaint_stats = {
#         "detail": "complaints_stats",
#         "data": await get_complaints_stats(session=session)
#     }
#     # ADMIN USER
#     admins = (await session.execute(select(Roles).options(selectinload(Roles.users)).where(Roles.name == "admin"))).scalars().all()
#     admin_ids = [str(us.id) for admin in admins for us in admin.users]

#     for admin_id in admin_ids:
#         await manager.broad_cast_personal_json(
#             user_id=admin_id, data=new_complaint_data_admin)
#         await manager.broad_cast_personal_json(
#             user_id=admin_id, data=new_complaint_stats)

#     return {
#         "detail": "Complaints Submitted"
#     }


# CREATE COMPLAINT ON SPECIFIC USER GENERIC COMPLAINTS'


# @router.post("/generic", status_code=status.HTTP_201_CREATED)
# async def create_generic_complaints(
#     user: UserModel = Depends(get_current_user),
#     session: AsyncSession = Depends(get_session),
#     issue: str = Form(...),
#     details: str = Form(...),   
#     location: VerifiedLocation = Depends(verifyLocation),
#     attachment: Optional[UploadFile] = File(None),
# ):
#     # UPLOAD IMAGE
#     uploaded_url = None
#     if attachment:
#         uploaded_url = await upload_image(file=attachment, folder="complaints")
#     # GET RECIEVED COMPLAINTS
#     received = (await session.execute(
#         select(ComplaintsStatusName).where(ComplaintsStatusName.status_name == "Received"))
#     ).scalars().first()
    
#     if not received:
#         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
#                             detail="Complaints Status Not Found")

#     status_updates = ComplaintsStatusUpdates(
#         status=received)

#     # COMPLAINT DESCRIPTION
#     description = f"""
#     Details: {details}"""

#     # CREATE COMPLAINT
#     new_complaints = Complaints(
#         subject=issue.upper(),
#         description=description,
#         reference_pole="Pole1",
#         location=location.geom,
#         village=location.village,
#         municipality=location.municipality,
#         user_id=user.id

#     )
#     new_complaints.status_updates.append(status_updates)
#     session.add(new_complaints)
    
#     # ADD COMPLAINTS IMAGE
#     if uploaded_url: 
#         image = ComplaintsImage(
#             image_url=uploaded_url
#         )
#         new_complaints.complaints_image.append(image)
#     await session.commit()
#     await session.refresh(new_complaints, attribute_names=["user", "status_updates"])

#     # QUERY THE LATEST COMPLAINT
#     data = await new_complaint(session=session, complaint_id=new_complaints.id, user_id=str(user.id))

#     json_data = {
#         "detail": "complaints",
#         "data": NewComplaintsModel(**data).model_dump()}

#     # SEND TO SPECIFIC  CLIENT
#     await manager.broad_cast_personal_json(user_id=str(user.id), data=json_data)

#     new_complaints_admin = {
#         "detail": "complaints_admin",
#         "data": NewComplaintsModel(**data).model_dump()}
#     new_complaints_stat = {
#         "detail": "complaints_stats",
#         "data": await get_complaints_stats(session=session)
#     }
#     # ADMIN USER
#     admins = (await session.execute(select(Roles).options(selectinload(Roles.users)).where(Roles.name == "admin"))).scalars().all()
#     admin_ids = [str(user.id)
#                  for admin_user in admins for user in admin_user.users]
   
#     for admin_id in admin_ids:
#         await manager.broad_cast_personal_json(
#             user_id=admin_id, data=new_complaints_admin)
#         await manager.broad_cast_personal_json(
#             user_id=admin_id, data=new_complaints_stat)
  

#     return {
#         "detail": "Complaints Submitted"
#     }


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
        put_services: PutServices = Depends(PutServices),
        get_services: GetServices = Depends(GetServices),
        user: UserModel = Depends(get_current_user),
        get_user:GetUserServices = Depends(GetUserServices),
        get_dashboard_services: GetDashboardServices = Depends(GetDashboardServices)
        ):

    if "admin" not in [role.name for role in user.roles]:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Admin Only Transaction Allowed")
    try:
        is_status_added, selected_status, selected_complaint = await put_services.add_new_status(complaints_id=complaint_id, stats=data.status_name)
        if not is_status_added:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Status Not Added")
        
        # ADD STATUS HISTORY
        data_history = Datahistory(
            complaint_id=selected_complaint.id,
            status_id=selected_status.id,
            user_id=str(user.id),
            comments=f"Updated to {data.status_name}"
        )
        is_history_added = await put_services.add_complaints_history(data=data_history)
        if not is_history_added:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="History Not Added")
        
        # SEND TO ADMIN AND TO SPECIFIC CLIENT
        admins = await get_user.get_users_by_roles(roles="admin")
        # APPEND USER ID IF IT IS NOT IN ADMIN
        if str(selected_complaint.user_id) not in admins:
            admins.append(str(selected_complaint.user_id))
        new_status = await get_services.get_new_complaints_status(complaints_id=complaint_id)
        new_stats = await get_dashboard_services.get_complaints_stats()
        new_complaint_status = {
            "detail": "new_status",
            "complaint_status": new_status,
            "complaints_stats": new_stats
        }
        
        
        # BROAD CAST NEW UPDATED DATA TO ALL ADMINS AND SPECIFIC CLIENT
        for admin in admins:
            await manager.broad_cast_personal_json(user_id=admin, data=new_complaint_status)

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
    data: ComplaintsStatus = Body(...),
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
        select_status = (await session.execute(select(ComplaintsStatusName).where( ComplaintsStatusName.id >= data.status_id))).scalars().all()
        selected_status_ids = [s.id for s in select_status]
        
        if not select_status:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Status Not Found")
        
        # DELETE STATEMENT
        try:
            delete_stmt = delete(ComplaintsStatusUpdates).where(
                and_(
                    ComplaintsStatusUpdates.complaints == select_complaint,
                    ComplaintsStatusUpdates.status_id.in_(selected_status_ids)))
            await session.execute(delete_stmt)
            await session.commit()
        except Exception as e:
            print(e)
        finally:
            await session.refresh(select_complaint)
        
        # ADD STATUS HISTORY
        for si in selected_status_ids:
            data_history = {
                "complaint_id": select_complaint.id,
                "status_id": si,
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
            "detail": "complaints_stats",
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

# ------------------------------------------------------Message----------------------------------------------------------------------------
# Complaints Message
@router.get("/message", status_code=status.HTTP_200_OK, response_model=list[Message])
async def get_complaints_message(get_message_services: GetMessageServices = Depends(GetMessageServices), complaints_id: int = Query(...)):
    return await get_message_services.get_message(complaints_id=complaints_id)

#  ------------------------------------------------------DashBoard-----------------------------------------------------------------------------
# Complaints Stats
@router.get("/stats", status_code=status.HTTP_200_OK, response_model=List[Stat])
async def complaints_stats(get_dashboardservices: GetDashboardServices = Depends(GetDashboardServices)):
    return await get_dashboardservices.get_complaints_stats()

@router.get("/top", status_code=status.HTTP_200_OK)
async def get_top_complaints(get_dashboardservices: GetDashboardServices = Depends(GetDashboardServices)):
    return await get_dashboardservices.get_top_complaints()

@router.get("/overtime", status_code=status.HTTP_200_OK)
async def complaint_overtime(get_dasboardservices: GetDashboardServices = Depends(GetDashboardServices)):
    return await get_dasboardservices.get_complaint_overtime()