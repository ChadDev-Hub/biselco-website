from fastapi import APIRouter, status, Depends, Form, Body, Query, File, UploadFile
from fastapi.exceptions import HTTPException
from sqlalchemy import select,  desc,  and_, update
from sqlalchemy.orm import selectinload
from ....dependencies.db_session import get_session
from ....core.security import get_current_user
from ..schema.requests_model import ComplaintsStatus
from sqlalchemy.ext.asyncio.session import AsyncSession
from shapely.geometry import Point
from geoalchemy2.shape import to_shape
from datetime import date, datetime
from ...websocket.websocket_manager import manager
from .. import *
from sqlalchemy.dialects.postgresql import UUID
from ..schema.response_model import  ComplaintStatusName, ComplaintsModelLists
from ...user.schema.response_model import UserModel
from typing import Optional
from ...gis.franchise_area.services.get_location import verifyLocation
from ...gis.franchise_area.schema.response_model import VerifiedLocation
from ..services.complaints_messages import get_message
from ...websocket.schema.response_model import Message
from ..schema.response_model import Stat
from asyncio import gather
from typing import List
from ..services.get2 import GetServices, GetDashboardServices, GetMessageServices
from ....dependencies.bucket3 import upload_image
from ..services.put import PutServices
from ..schema.requests_model import Datahistory
from ...user.service.get_user import GetUserServices
from ..services.delete import DeleteServices
from ..services.post import PostServices
from ..schema.requests_model import CreateComplaints
from ....core.redis import CHANNEL, redis_client
import json
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
        search: Optional[str] = Query(None),
        page: Optional[int] = Query(None),
        get_services: GetServices = Depends(GetServices),
        user: UserModel = Depends(get_current_user)):
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User Not Found")
    if "admin" not in [role.name.lower() for role in user.roles]:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Admin Only Transaction Allowed")
    data = await get_services.get_all_complaints(query=search, page=page)
    return data


# GET ALL COMPLAINTS STATUS NAME
@router.get("/status/name", status_code=status.HTTP_200_OK, response_model=list[ComplaintStatusName])
async def get_complaints_status_name(session: AsyncSession = Depends(get_session)):
    status_name = (await session.execute(select(ComplaintsStatusName).order_by(desc(ComplaintsStatusName.id)))).scalars().all()
    return status_name

# CREATE COMPLAINTS ON SPECIFIC USER  (METER)
@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_complaints(
    user: UserModel = Depends(get_current_user),
    accountNumber:Optional[str]= Form(None),
    issue: str = Form(...),
    details: str = Form(...),
    is_meter_complaint: bool = Form(...),
    location: VerifiedLocation = Depends(verifyLocation),
    attachment: Optional[UploadFile] = File(None),
    post_service: PostServices = Depends(PostServices),
    get_user: GetUserServices = Depends(GetUserServices),
    get_dashboard_services: GetDashboardServices = Depends(GetDashboardServices)
    
):
    data = CreateComplaints(
        account_no=accountNumber,
        subject=issue,
        details=details,
        location=location.geom,
        village=location.village,
        municipality=location.municipality,
        user_id=str(user.id)
    )
    
    results = await post_service.post_new_complaint(
        data=data,
        is_meter_complaint=is_meter_complaint,
        image=attachment)
    new_stats = await get_dashboard_services.get_complaints_stats()
    results['stats'] = new_stats
    
    
    # ADMIN USER
    admins = await get_user.get_users_by_roles(roles="admin")
    if str(user.id) not in admins: 
        admins.append(str(user.id))
        
    # # BROADCAST TO USERS
    # for users in admins:
    for admin in admins:
        # await manager.broad_cast_personal_json(
        #     user_id=admin,
        #     data=results
        # )
        payload = {
            'type': 'personal',
            'user_id': admin,
            'data': results
        }
        await redis_client.publish(CHANNEL,json.dumps(payload))

    return {
        "detail": "Complaints Submitted"
    }



@router.delete("/{complaint_id}", status_code=status.HTTP_200_OK)
async def delete_complaint(
        complaint_id: int,
        session: AsyncSession = Depends(get_session),
        user: UserModel = Depends(get_current_user),
        get_user:GetUserServices = Depends(GetUserServices)):
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
        
        deleted = {
            "detail": "deleted_complaints",
            "data": deleted_complaint,
        }
        admins = await get_user.get_users_by_roles(roles="admin")
        if str(user.id) not in admins:
            admins.append(str(user.id))
        for admin in admins:
            await manager.broad_cast_personal_json(user_id=admin, data=deleted)
        

    except Exception as e:
        return e
    return {
        "detail": "Successfully Deleted"
    }

# UPDATE COMPLAINT STATUS


@router.put("/status/{complaint_id}", status_code=status.HTTP_201_CREATED)
async def update_complaint_status(
        complaint_id: int,
        data: ComplaintsStatus = Body(...),
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
        is_status_added, selected_status, selected_complaint = (await put_services.add_new_status(complaints_id=complaint_id,
                                                                                stats=data.status_id,
                                                                                current_status_id=data.current_status_id))
        if not is_status_added:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Status Not Added")
        # ADD STATUS HISTORY
        data_history = [Datahistory(
            complaint_id=selected_complaint.id,
            status_id=s.id,
            user_id=str(user.id),
            comments=f"Updated to {s.status_name}"
        ).model_dump(mode="python")
        for s in selected_status]
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
        return HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    return {
        "detail": f"{data.status_name} Successfully Updated"
    }


# DELETE STATUS
@router.delete("/status/{complaint_id}", status_code=status.HTTP_200_OK)
async def delete_complaint_status(
    complaint_id: int,
    delete_services:DeleteServices = Depends(DeleteServices),
    get_user:GetUserServices = Depends(GetUserServices),
    get_dashboard_services:GetDashboardServices = Depends(GetDashboardServices),
    data: ComplaintsStatus = Body(...),
    user: UserModel = Depends(get_current_user),
):
    if "admin" not in [role.name for role in user.roles]:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Admin Only Transaction Allowed")
    try:
        new_complaints_status, selected_complaints = await delete_services.delete_complaint_status(
            user_id=str(user.id),
            complaint_id=complaint_id,
            status_id=data.status_id,
            current_status_id=data.current_status_id
        )
        new_stats = await get_dashboard_services.get_complaints_stats()
        roles = await get_user.get_users_by_roles(roles="admin")
        
        # APPEND USER ID IF IT IS NOT IN ADMIN
        if str(selected_complaints.user_id) not in roles:
            roles.append(str(selected_complaints.user_id))
        # TASK
        new_status = {
            "detail": "new_status",
            "complaint_status": new_complaints_status,
            "complaints_stats": new_stats
        }
        # BROAD CAST NEW UPDATED DATA TO ALL ADMINS AND SPECIFIC CLIENT
        for admin in roles:
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