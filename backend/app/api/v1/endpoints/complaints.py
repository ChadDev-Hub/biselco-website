from fastapi import APIRouter, status, Depends, Form, WebSocketDisconnect, WebSocket,Body
from fastapi.exceptions import HTTPException
from sqlalchemy import select, asc, desc, delete, and_
from sqlalchemy.orm import selectinload
from ....dependencies.db_session import get_session
from ....core.security import get_current_user, get_current_user_ws
from ....modules.complaints.schema.requests_model import ComplaintsStatus, CreateComplaints
from sqlalchemy.ext.asyncio.session import AsyncSession
from geoalchemy2.functions import ST_Point, ST_X, ST_Y, ST_SRID
from shapely.geometry import Point
from ....dependencies.get_complaints import complaints, new_complaint, user_complaints, new_complaints_status
from geoalchemy2.shape import to_shape
from datetime import date, datetime
from ....core.websocket_manager import manager
from ....modules.complaints import *
from ....modules.user import Users, Roles
from sqlalchemy.dialects.postgresql import UUID
router = APIRouter(prefix="/complaints", tags=["Complaints"])


# GET ALL COMPLAINTS FOR SPECIFIC USER
@router.get("/", status_code=status.HTTP_200_OK)
async def get_user_complaints(user:dict = Depends(get_current_user),session:AsyncSession = Depends(get_session)):
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized Transaction")
    user_id = user.get("user_id")
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized User")
    complaint =  await user_complaints(session=session, user_id=user_id)
    return complaint


#GET ALL COMPLAINTS
@router.get("/all", status_code=status.HTTP_200_OK)
async def get_all_complaint(session:AsyncSession = Depends(get_session)):
    return await complaints(session=session)


# GET ALL COMPLAINTS STATUS NAME
@router.get("/status/name", status_code=status.HTTP_200_OK)
async def get_complaints_status_name(session:AsyncSession = Depends(get_session)):
    status_name = (await session.execute(select(ComplaintsStatusName).order_by(desc(ComplaintsStatusName.id)))).scalars().all()
    return status_name

# CREATE ALL COMPLAINTS ON SPECIFIC USER 
@router.post("/create", status_code=status.HTTP_201_CREATED)
async def create_complaints(
    user:dict = Depends(get_current_user), 
    session:AsyncSession = Depends(get_session), 
    form:CreateComplaints = Form()):
    # USER VERIFICATION
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized Transaction")
    user_id = user.get("user_id")
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized Transaction")
    current_user = await session.scalar(select(Users).where(Users.id == user_id))
    if not current_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized User")
    
    # GET RECEIVED COMPLAINTS
    received = (await session.execute(
        select(ComplaintsStatusName).where(ComplaintsStatusName.status_name == "Received"))
    ).scalars().first()
    if not received:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Complaints Status Not Found")
    # CREATE COMPLAINT
    location = ST_Point(form.longitude, form.latitude, srid=4326)
    new_complaints = Complaints(
        subject = form.subject,
        description = form.description,
        reference_pole = "Pole1",
        location = location,
        village = "Bintuan",
        municipality = "Coron",
        user = current_user
    )

    status_updates = ComplaintsStatusUpdates(
            date = datetime.now().date(),
            time = datetime.now().time(),
            status = received)
    new_complaints.status_updates.append(status_updates)
    session.add(new_complaints)
    await session.commit()
    await session.refresh(new_complaints, attribute_names=["user", "status_updates"])

    # QUERY THE LATEST COMPLAINT
    data = await new_complaint(session=session, complaint_id=new_complaints.id, user_id=user_id)
    
    # SEND TO ADMIN AND SPECIFIC  CLIENT
    # ADMIN USER
    admins = (await session.execute(select(Roles).options(selectinload(Roles.users)).where(Roles.name == "admin"))).scalars().all()
    admin_ids = [user.id for  admin_user in  admins  for  user in admin_user.users]
    if user_id not in admin_ids or not admin_ids:
        admin_ids.append(user_id)   
    print(admin_ids)
    for admin_id in admin_ids:
        await manager.broad_cast_personal_json(user_id=admin_id, data=data)
    await session.close()
    
    return {
        "detail" : "Complaints Submitted"
    }

# DELETE COMPLAINT
@router.delete("/delete/{complaint_id}", status_code=status.HTTP_200_OK)
async def delete_complaint(complaint_id:int, session:AsyncSession = Depends(get_session), user:dict = Depends(get_current_user)):
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized Transaction")
    user_id = user.get("user_id")
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized User")
    try:
        select_stmt = select(Complaints).where(Complaints.id == complaint_id)
        data = (await session.execute(select_stmt)).scalar_one_or_none()
        
        if not data:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Complaint Not Found")
        
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
        delete_stmt = delete(Complaints).where(Complaints.id == complaint_id)
        await session.execute(delete_stmt)
        await session.commit()
        await session.close()
        admins = (await session.execute(select(Roles).options(selectinload(Roles.users)).where(Roles.name == "admin"))).scalars().all()
        admin_ids = [user.id for  admin_user in  admins  for  user in admin_user.users]
        
        if user_id not in admin_ids:
            admin_ids.append(user_id)
        for admin in admin_ids:
            to_send = {
                "detail": "deleted complaint",
                "data": deleted_complaint,
            }
            await manager.broad_cast_personal_json(user_id=admin, data=to_send)
    except Exception as e:
        return e
    return {
        "detail" : "Successfully Deleted"
    }    
    
# UPDATE COMPLAINT STATUS
@router.put("/update/status/{complaint_id}", status_code=status.HTTP_201_CREATED)
async def update_complaint_status(
    complaint_id:int,
    data:ComplaintsStatus = Body(),
    session:AsyncSession = Depends(get_session),
    user:dict = Depends(get_current_user)):
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized Transaction")
    # CLIENT
    user_id = data.user_id
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized User")
    if user.get("role") != "admin":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Admin Only Transaction Allowed")
    try:
        select_complaint = (await session.execute(select(Complaints).where(Complaints.id == complaint_id))).scalar_one_or_none()
        if not select_complaint:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Complaint Not Found")
        select_status = (await session.execute(select(ComplaintsStatusName).where(ComplaintsStatusName.status_name == data.status_name))).scalar_one_or_none()
        if not select_status:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Status Not Found")
        new_status = ComplaintsStatusUpdates(
            date = datetime.now().date(),
            time = datetime.now().time(),
            complaints = select_complaint,
            status = select_status
        )
        session.add(new_status)
        await session.commit()
        await session.refresh(select_complaint, attribute_names=["status_updates"])
        await session.close()
        
        # SEND TO ADMIN AND TO SPECIFIC CLIENT 
        # ADMINS
        admins = (await session.execute(select(Roles).options(selectinload(Roles.users)).where(Roles.name == "admin"))).scalars().all()
        admin_ids = [user.id for  admin_user in  admins  for  user in admin_user.users]
        new_status = await new_complaints_status(session=session, complaint_id=complaint_id)
        
        
        
        # APPEND USER ID IF IT IS NOT IN ADMIN
        new_complaints_data = {
            "detail": "complaints",
            "data": new_status
        }
        await manager.broad_cast_personal_json(user_id=user_id, data=new_complaints_data)
        
        # BROAD CAST NEW UPDATED DATA TO ALL ADMINS AND SPECIFIC CLIENT
        for admin in admin_ids:
            to_send = {
                "detail": "complaints status",
                "data": new_status,
            }
            await manager.broad_cast_personal_json(user_id=admin, data=to_send)
    except Exception as e:
        return e
    return {
        "detail" : f"{data.status_name} Successfully Updated"
    }
        

# DELETE STATUS 
@router.delete("/delete/status/{complaint_id}", status_code=status.HTTP_200_OK)
async def delete_complaint_status(
    complaint_id:int,
    session:AsyncSession = Depends(get_session), 
    data:ComplaintsStatus = Body(),
    user:dict = Depends(get_current_user),
    ):
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized Transaction")
    if user.get("role") != "admin":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Admin Only Transaction Allowed")
    try:
        select_complaint = (await session.execute(select(Complaints).where(Complaints.id == complaint_id))).scalar_one_or_none()
        if not select_complaint:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Complaint Not Found")
        select_status = (await session.execute(select(ComplaintsStatusName).where(ComplaintsStatusName.status_name == data.status_name))).scalar_one_or_none()
        if not select_status:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Status Not Found")
        delete_stmt = delete(ComplaintsStatusUpdates).where(
            and_(
            ComplaintsStatusUpdates.complaints == select_complaint, 
            ComplaintsStatusUpdates.status == select_status)
            )
        await session.execute(delete_stmt)
        await session.commit()
        await session.close()
        
        # BROADCAST
        admin = (await session.execute(select(Roles).options(selectinload(Roles.users)).where(Roles.name == "admin"))).scalars().all()
        admin_ids = [user.id for  admin_user in  admin  for  user in admin_user.users]
        user_id = data.user_id
        new_status = await new_complaints_status(session=session, complaint_id=complaint_id)
        
        new_complaint_data = {
            "detail": "complaints",
            "data": new_status
        }
        await manager.broad_cast_personal_json(user_id=user_id, data=new_complaint_data)
        for admin in admin_ids:
            to_send = {
                "detail": "complaints status",
                "data": new_status,
            }
            await manager.broad_cast_personal_json(user_id=admin, data=to_send)
    except Exception as e:
        return e
    return {
        "detail" : f"{data.status_name} Successfully Updated"
    }
