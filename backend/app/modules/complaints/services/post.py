from fastapi import HTTPException, status
from sqlalchemy import select
from ..model.complaints import Complaints
from ..model.status_name import ComplaintsStatusName, ComplaintsStatusUpdates
from ..model.complaint_image import ComplaintsImage
from sqlalchemy.ext.asyncio import AsyncSession
from ...gis.consumer.model.consumer import ConsumerMeter
from ..schema.requests_model import CreateComplaints
from ..services.get import new_complaint
from ....common.total_page import get_total_page
class Postcomplaints:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.PAGESIZE=10

    # GET RECEIVE STATUS NAME
    async def get_status_name(self):
        self.received = (await self.session.execute(select(ComplaintsStatusName).where(ComplaintsStatusName.status_name == "Received"))).scalars().first()
        if not self.received:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                                detail="Complaints Status Not Found")
        return self.received

    # VERIFY CONSUMER ACCOUNT
    async def verify_consumer_account(self, account_no: str, detail:str):
        self.account = (await self.session.execute(select(ConsumerMeter).where(ConsumerMeter.account_no == account_no))).scalar_one_or_none()
        
        if self.account:
            self.description = f"""
        Account Number: {self.account.account_no}\n
        Consumer Name: {self.account.account_name}\n
        Meter Number: {self.account.meter_no}\n
        Meter Brand: {self.account.meter_brand}\n\n
        Details: {detail}"""
        else:
            self.description = f"""
            Account Number: {account_no}\n\n
            Details: {detail}"""
        return self.description


    # CREATE COMPLAINTS
    async def create_metercomplaints(self, data:CreateComplaints):
        self.received = await self.get_status_name()
        self.description = await self.verify_consumer_account(account_no=data.account_no, detail=data.details)
        self.total_page = await get_total_page(session=self.session, model=Complaints, pagesize=self.PAGESIZE)
        
            # CREATE COMPLAINT
        new_complaints = Complaints(
            subject= data.issue,
            description=self.description,
            reference_pole="Pole1",
            location=data.geom,
            village=data.village,
            municipality=data.municipality,
            user_id=data.user_id,
        )
        self.session.add(new_complaints)
        await self.session.flush()
        
        if new_complaints:
            status_updates = ComplaintsStatusUpdates(
                status=self.received,
                complaint_id=new_complaints.id
            )
            
            images = ComplaintsImage(
                image_url=data.imageurl
            )
            self.session.add(status_updates)
            self.session.add(images)
        await self.session.commit()
        return new_complaint(session=self.session, complaint_id=new_complaints.id,user_id=data.user_id)
 