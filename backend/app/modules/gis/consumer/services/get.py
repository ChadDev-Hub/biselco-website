from sqlalchemy import select
from ..model.consumer import ConsumerMeter
from .....dependencies.db_session import get_session
from fastapi import Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from ..schema.response_model import ConsumerVerification
from geojson_pydantic import Feature, Point
from geoalchemy2.shape import to_shape
from shapely.geometry import Point as PointShape

class ConsumerMeterGetService:
    def __init__(self, session: AsyncSession = Depends(get_session)):
        self.session = session

    async def verfify_account_no(self, account_no: str) -> ConsumerVerification:

        stmt = select(ConsumerMeter).where(
            ConsumerMeter.account_no == account_no)
        data = (await self.session.execute(stmt)).scalar_one_or_none()
        if not data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Account not Found")
        return ConsumerVerification(account_no=data.account_no)
    
    
    async def  get_consumer_meters(self):
        try:
            stmt = select(ConsumerMeter).where(
                ConsumerMeter.geom.is_not(None))
            data = (await self.session.execute(stmt)).scalars().all()
            feature = [
                Feature(
                    type="Feature",
                    geometry=Point(
                        type="Point",
                        coordinates=(
                            to_shape(f.geom).x,
                            to_shape(f.geom).y
                        ),
                        srid=4326
                    ),
                    properties={
                        "id":  f.id,
                        "hash": f.hash,
                        "account_no": f.account_no,
                        "account_name": f.account_name,
                        "meter_no": f.meter_no,
                        "meter_brand": f.meter_brand
                    }
                )
                
                for f in data
            ]

            
            return feature
        except Exception as e:
            print(e)
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
