from fastapi import APIRouter, status, Depends, Form, WebSocketDisconnect, WebSocket
from fastapi.exceptions import HTTPException
from sqlalchemy import select, asc, desc, delete
from sqlalchemy.orm import selectinload
from ....dependencies.db_session import get_session
from ....utils.token import get_current_user, get_current_user_ws
from ....schema.form import CreateComplaints
from ....schema.requests_body import ComplaintsStatus
from sqlalchemy.ext.asyncio.session import AsyncSession
from geoalchemy2.functions import ST_Point, ST_X, ST_Y, ST_SRID
from shapely.geometry import Point
from ....dependencies.get_complaints import complaints, new_complaint, user_complaints
from geoalchemy2.shape import to_shape
from ....models import Complaints, Users, Roles, ComplaintsStatusName, ComplaintsStatusUpdates
from datetime import date, datetime
from ....core.websocket_manager import manager

router = APIRouter(prefix="/complaints", tags=["Complaints"])


# GET ALL COMPLAINTS FOR SPECIFIC USER
@router.get("/", status_code=status.HTTP_200_OK)
async def get_user_complaints(user:dict = Depends(get_current_user),session:AsyncSession = Depends(get_session)):
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized Transaction")
    user_id = user.get("userid")
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

# CREATE ALL COMPLAINTS
@router.post("/create", status_code=status.HTTP_201_CREATED)
async def create_complaints(
    user:dict = Depends(get_current_user), 
    session:AsyncSession = Depends(get_session), 
    form:CreateComplaints = Form()):
    # USER VERIFICATION
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized Transaction")
    user_id = user.get("userid")
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
    if user_id not in admin_ids:
        admin_ids.append(user_id)   

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
        print(deleted_complaint)
        delete_stmt = delete(Complaints).where(Complaints.id == complaint_id)
        await session.execute(delete_stmt)
        await session.commit()
        await session.close()
        admins = (await session.execute(select(Roles).options(selectinload(Roles.users)).where(Roles.name == "admin"))).scalars().all()
        admin_ids = [user.id for  admin_user in  admins  for  user in admin_user.users]
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
    data:ComplaintsStatus,
    session:AsyncSession = Depends(get_session),
    user:dict = Depends(get_current_user)):
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized Transaction")
    if user.get("role") != "admin":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Admin Only Transaction Allowed")
    print(data)
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
        select_complaint.status_updates.append(new_status)
        await session.commit()
        await session.refresh(select_complaint, attribute_names=["status_updates"])
        await session.close()
    except Exception as e:
        return e
    return {
        "detail" : f"{data.status_name} Successfully Updated"
    }
        
        
    
