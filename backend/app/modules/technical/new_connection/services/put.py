
from fastapi import HTTPException, status, Depends 
from sqlalchemy.ext.asyncio import AsyncSession
from .....dependencies.db_session import get_session
from ..schema.requests_model import NewConnectionSyncRequests
from ....gis.franchise_area.services.get_location import verifyLocation
from sqlalchemy.dialects.postgresql import insert
from .....dependencies.bucket3 import upload_image
from ..model.new_connection import NewConnection, NewConnectionImage
from .....dependencies.hash_image import hash_image
from sqlalchemy import select
class PutNewConnectionService:
    def __init__(self, session: AsyncSession = Depends(get_session)):
        self.session = session
        
    async def sync_new_connection(self, data:NewConnectionSyncRequests):
        try:
            location = await verifyLocation(lon=data.lon, lat=data.lat, session=self.session)
            insertdata = {
                "uuid": data.uuid,
                "form_id": 4,
                "date_accomplished": data.date_accomplished,
                "consumer_name": data.consumer_name,
                "meter_brand": data.meter_brand,
                "meter_serial_no": data.meter_serial_no,
                "meter_sealed": data.meter_sealed,
                "multiplier": data.multiplier,
                "initial_reading": data.initial_reading,
                "remarks": data.remarks,
                "accomplished_by": data.accomplished_by,
                "location": f"{location.village} | {location.municipality}",
                "geom": location.geom,
                "is_synced": True
            }
            insert_stmt = insert(NewConnection).values(insertdata)
            upsert_stmt = insert_stmt.on_conflict_do_update(
                index_elements=[NewConnection.uuid],
                set_={
                    NewConnection.form_id: insert_stmt.excluded.form_id,
                    NewConnection.date_accomplished: insert_stmt.excluded.date_accomplished,
                    NewConnection.location: insert_stmt.excluded.location,
                    NewConnection.consumer_name: insert_stmt.excluded.consumer_name,
                    NewConnection.meter_brand: insert_stmt.excluded.meter_brand,
                    NewConnection.meter_serial_no: insert_stmt.excluded.meter_serial_no,
                    NewConnection.meter_sealed: insert_stmt.excluded.meter_sealed,
                    NewConnection.multiplier: insert_stmt.excluded.multiplier,
                    NewConnection.initial_reading: insert_stmt.excluded.initial_reading,
                    NewConnection.remarks: insert_stmt.excluded.remarks,
                    NewConnection.accomplished_by: insert_stmt.excluded.accomplished_by,
                    NewConnection.is_synced: insert_stmt.excluded.is_synced,
                    NewConnection.geom: insert_stmt.excluded.geom,
                    }
            ).returning(NewConnection.id)
            new_connection = (await self.session.execute(upsert_stmt)).scalar_one()
            
            if data.image:
                image_hash = hash_image(data.image.file)
            
            existing_img_hash = (await self.session.execute(select(NewConnectionImage).where(
                NewConnectionImage.new_connection_id == new_connection))).scalar_one_or_none()
            
            if existing_img_hash is None or existing_img_hash.image_hash != image_hash:
                image_url = await upload_image(file=data.image, folder="new_connection")
                img_insrt = {
                    "new_connection_id": new_connection,
                    "image": image_url,
                    "image_hash": image_hash
                }
                if existing_img_hash is not None:
                    img_insrt["id"] = existing_img_hash.id
                
                insrt_tmt = insert(NewConnectionImage).values(img_insrt)
                upsert_tmt = insrt_tmt.on_conflict_do_update(
                    index_elements=[NewConnectionImage.id],
                    set_={
                        NewConnectionImage.new_connection_id: insrt_tmt.excluded.new_connection_id,
                        NewConnectionImage.image: insrt_tmt.excluded.image,
                        NewConnectionImage.image_hash: insrt_tmt.excluded.image_hash,
                    }
                )
                await self.session.execute(upsert_tmt)
            await self.session.commit()
            # QUERY LATEST DATA
            result = (await self.session.execute(select(NewConnection).where(NewConnection.id == new_connection))).scalar_one()
            
            # CREATE NEW CONNECTION DATA
            new_connection_data = {
                "uuid": result.uuid,
                "is_synced": result.is_synced,
            }
            return new_connection_data
        except Exception as e:
            await self.session.rollback()
            print(e)
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))