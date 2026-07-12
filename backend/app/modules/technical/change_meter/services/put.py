from fastapi import HTTPException, status, Depends
from ..model.change_meter import ChangeMeter, ChangeMeterImage
from sqlalchemy.dialects.postgresql import insert
from ....gis.franchise_area.services.get_location import verifyLocation
from .....dependencies.db_session import get_session
from sqlalchemy.ext.asyncio import AsyncSession
from ..schema.requests_model import ChangeMeterSyncRequests
from .....dependencies.hash_image import hash_image
from .....dependencies.bucket3 import upload_image
from sqlalchemy import select
from datetime import datetime
from pytz import timezone
class ChangeMeterPutServices:
    def __init__(self, session: AsyncSession = Depends(get_session)):
        self.session = session

    async def sync_change_meter(self, data: ChangeMeterSyncRequests):
        try:

            location = await verifyLocation(lon=data.lon, lat=data.lat, session=self.session)
            insertdata = {
                "uuid": data.uuid,
                "form_id": 3,
                "date_accomplished": data.date_accomplished,
                "account_no": data.account_no,
                "consumer_name": data.consumer_name,
                "location": f"{location.village} | {location.municipality}",
                "pull_out_meter": f"{data.pull_out_meter_serial_no} | {data.pull_out_meter}",
                "pull_out_meter_reading": data.pull_out_reading,
                "new_meter_serial_no": data.new_meter_serial_no,
                "new_meter_brand": data.new_meter_brand,
                "meter_sealed": data.meter_sealed,
                "initial_reading": data.initial_reading,
                "remarks": data.remarks,
                "accomplished_by": data.accomplished_by,
                "is_synced": True,
                "datetime_synced": datetime.now(),
                "geom": location.geom,
                "sitio": data.sitio,
                "is_deleted": data.is_deleted,
                "datetime_deleted": data.datetime_deleted
            }

            insrt_stmt = insert(ChangeMeter).values(insertdata)
            upsert_stms = insrt_stmt.on_conflict_do_update(
                index_elements=[ChangeMeter.uuid],
                set_={
                    ChangeMeter.date_accomplished: insrt_stmt.excluded.date_accomplished,
                    ChangeMeter.form_id: insrt_stmt.excluded.form_id,
                    ChangeMeter.account_no: insrt_stmt.excluded.account_no,
                    ChangeMeter.location: insrt_stmt.excluded.location,
                    ChangeMeter.consumer_name: insrt_stmt.excluded.consumer_name,
                    ChangeMeter.pull_out_meter: insrt_stmt.excluded.pull_out_meter,
                    ChangeMeter.pull_out_meter_reading: insrt_stmt.excluded.pull_out_meter_reading,
                    ChangeMeter.new_meter_serial_no: insrt_stmt.excluded.new_meter_serial_no,
                    ChangeMeter.new_meter_brand: insrt_stmt.excluded.new_meter_brand,
                    ChangeMeter.meter_sealed: insrt_stmt.excluded.meter_sealed,
                    ChangeMeter.initial_reading: insrt_stmt.excluded.initial_reading,
                    ChangeMeter.remarks: insrt_stmt.excluded.remarks,
                    ChangeMeter.accomplished_by: insrt_stmt.excluded.accomplished_by,
                    ChangeMeter.is_synced: insrt_stmt.excluded.is_synced,
                    ChangeMeter.datetime_synced: insrt_stmt.excluded.datetime_synced,
                    ChangeMeter.geom: insrt_stmt.excluded.geom,
                    ChangeMeter.sitio: insrt_stmt.excluded.sitio,
                    ChangeMeter.is_deleted: insrt_stmt.excluded.is_deleted,
                    ChangeMeter.datetime_deleted: insrt_stmt.excluded.datetime_deleted
                }
            ).returning(ChangeMeter.id)
            change_meter_id = (await self.session.execute(upsert_stms)).scalar_one()
            if data.image:
                image_hash = hash_image(data.image.file)

            existing_image_hash = (await self.session.execute(select(ChangeMeterImage).where(ChangeMeterImage.change_meter_id == change_meter_id))).scalar_one_or_none()
            
            if existing_image_hash is None or existing_image_hash.image_hash != image_hash:
                image_url = await upload_image(file=data.image, folder="change_meter")
                image_insrt = {
                    "change_meter_id": change_meter_id,
                    "image": image_url,
                    "image_hash": image_hash
                }
                if existing_image_hash is not None:
                    image_insrt["id"] = existing_image_hash.id
                    
                insrt_image_stmt = insert(ChangeMeterImage).values(image_insrt)
                upsert_image_stmt = insrt_image_stmt.on_conflict_do_update(
                    index_elements=[ChangeMeterImage.id],
                    set_={
                        ChangeMeterImage.change_meter_id: insrt_image_stmt.excluded.change_meter_id,
                        ChangeMeterImage.image: insrt_image_stmt.excluded.image,
                        ChangeMeterImage.image_hash: insrt_image_stmt.excluded.image_hash
                    }
                )
                
                await self.session.execute(upsert_image_stmt)
            await self.session.commit()
            result = (await self.session.execute(select(ChangeMeter).where(ChangeMeter.id == change_meter_id))).scalar_one_or_none()
            return {
                "uuid": result.uuid,
                "is_synced": result.is_synced,
                "datetime_synced": result.datetime_synced.astimezone(timezone("Asia/Manila")).strftime("%Y-%m-%d %I:%M %p")
            }
            
        except Exception as e:
            print(e)
            await self.session.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
