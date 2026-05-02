from fastapi import HTTPException, status, Depends
from sqlalchemy import select
from ..model.complaints import Complaints
from ..model.status_name import ComplaintsStatusName
from ..model.status_update import ComplaintsStatusUpdates
from ..model.complaint_image import ComplaintsImage
from sqlalchemy.ext.asyncio import AsyncSession
from ...gis.consumer.model.consumer import ConsumerMeter
from ..schema.requests_model import CreateComplaints
from ..services.get import new_complaint
from ....common.total_page import get_total_page
from ..services.get2 import GetServices
from typing import Optional


class PostServices:
    def __init__(self, get_services: GetServices = Depends(GetServices)):
        self.session = get_services.session
        self.get_services = get_services
        self.PAGESIZE = get_services.PAGESIZE

    # GET RECEIVE STATUS NAME
    async def get_status_name(self):
        self.received = await self.get_services.get_seleted_status_name(status_id=1)
        print(self.received)
        if not self.received:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                                detail="Complaints Status Not Found")
        return self.received[0]

    # VERIFY CONSUMER ACCOUNT
    async def verify_consumer_account(self,detail: str, account_no:Optional[str] = None):
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
    async def post_new_complaint(self, data: CreateComplaints, is_meter_complaint: bool = False):
        try:
            self.received = await self.get_status_name()
            if is_meter_complaint:
                self.description = await self.verify_consumer_account(account_no=data.account_no, detail=data.details)
            else:
                
                self.description = f"""Details: {data.details}"""

            # CREATE COMPLAINT
            new_complaints = Complaints(
                subject=data.subject.upper(),
                description=self.description,
                reference_pole="Pole1",
                location=data.location,
                village=data.village,
                municipality=data.municipality,
                user_id=data.user_id,
            )
            self.session.add(new_complaints)
            await self.session.flush()
            if new_complaints:
                status_updates = ComplaintsStatusUpdates(
                    status_id=self.received.id,
                    complaint_id=new_complaints.id
                )
                self.session.add(status_updates)
            if data.imageurl:
                images = ComplaintsImage(
                    complaints_id=new_complaints.id,
                    image_url=data.imageurl
                )
                self.session.add(images)
            await self.session.commit()
            results = await self.get_services.get_new_complaints(complaint_id=new_complaints.id)
            return results
        except Exception as e:
            print(e)
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
        
      
