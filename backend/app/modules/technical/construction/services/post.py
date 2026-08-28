from fastapi import HTTPException, status, Depends
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.exc import IntegrityError
from sqlalchemy import select, update
from ..model.construction import LineConstruction, TransformerInstallation, Construction, LineConstructionImage, TransformerInstallationImage
from .....dependencies.hash_image import hash_image
from .....dependencies.bucket3 import upload_image
from .....dependencies.db_session import get_session
from datetime import datetime
from ....gis.franchise_area.services.get_location import verifyLocation
from sqlalchemy.ext.asyncio import AsyncSession
from ..schema.requests import NewPrimaryLine
from geoalchemy2.functions import ST_Point
from pprint import pprint
from pytz import timezone


class PostServices:
    def __init__(self, session: AsyncSession = Depends(get_session)):
        self.session = session

    async def verify_existing_image_hash(self, image_hash, current_line_id):
        existing_hash_image = (await self.session.execute(
            select(LineConstructionImage).where(
                LineConstructionImage.image_hash == image_hash,
                LineConstructionImage.line_construction_id != current_line_id
            )
        )).scalar_one_or_none()
        
        if existing_hash_image:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT, detail="Image already exists")

    async def synced_line_construciton(self, data: NewPrimaryLine):
        try:
            location = await verifyLocation(lon=data.lon, lat=data.lat, session=self.session)
            # UPSERT FOR CONSTRUCTION

            cons_insert_stmt = insert(Construction).values(
                uuid=data.const_uuid,
                activity=data.activity,
                date_accomplished=data.date_accomplished,
                description=data.description
            )
            const_update_stmt = cons_insert_stmt.on_conflict_do_update(
                index_elements=[Construction.uuid],
                set_={
                    "activity": cons_insert_stmt.excluded.activity,
                    "date_accomplished": cons_insert_stmt.excluded.date_accomplished,
                    "description": cons_insert_stmt.excluded.description
                }
            ).returning(Construction.id)

            cons_id = (await self.session.execute(const_update_stmt)).scalar_one()

            # UPSERT FOR  LINE CONSTRUCTION TABLE
            line_insrt_stmt = insert(LineConstruction).values(
                uuid=data.uuid,
                construction_id=cons_id,
                type=data.type,
                line_type=data.line_type,
                phasing=data.phasing,
                pole_assembly=data.pole_assembly,
                conductor=data.conductor,
                neutral=data.neutral,
                geometry=location.geom,
                village_id=location.village_id,
                municipality_id=location.municipal_id,
                is_deleted=data.is_deleted,
                datetime_deleted=data.datetime_deleted,
                is_synced=True,
                datetime_synced=datetime.now()
            )

            line_upsert_stmt = line_insrt_stmt.on_conflict_do_update(
                index_elements=[LineConstruction.uuid],
                set_={
                    LineConstruction.type: line_insrt_stmt.excluded.type,
                    LineConstruction.line_type: line_insrt_stmt.excluded.line_type,
                    LineConstruction.phasing: line_insrt_stmt.excluded.phasing,
                    LineConstruction.pole_assembly: line_insrt_stmt.excluded.pole_assembly,
                    LineConstruction.conductor: line_insrt_stmt.excluded.conductor,
                    LineConstruction.neutral: line_insrt_stmt.excluded.neutral,
                    LineConstruction.geometry: line_insrt_stmt.excluded.geometry,
                    LineConstruction.village_id: line_insrt_stmt.excluded.village_id,
                    LineConstruction.municipality_id: line_insrt_stmt.excluded.municipality_id,
                    LineConstruction.is_deleted: line_insrt_stmt.excluded.is_deleted,
                    LineConstruction.datetime_deleted: line_insrt_stmt.excluded.datetime_deleted,
                    LineConstruction.is_synced: line_insrt_stmt.excluded.is_synced,
                    LineConstruction.datetime_synced: line_insrt_stmt.excluded.datetime_synced
                }
            ).returning(LineConstruction.id)

            line_id = (await self.session.execute(line_upsert_stmt)).scalar_one()
        
            # IMAGE UPLOADE
            image_hash = hash_image(data.image.file)

            # query existing image hash by hash and check if it is the same and the line id is not
            await self.verify_existing_image_hash(image_hash, line_id)

            existing_image = (await self.session.execute(
                select(LineConstructionImage).where(
                    LineConstructionImage.line_construction_id == line_id
                )
            )).scalar_one_or_none()

            if existing_image is None or existing_image.image_hash != image_hash:
                image_url = await upload_image(data.image, "line_construction")
                line_image = {
                    LineConstructionImage.image: image_url,
                    LineConstructionImage.image_hash: image_hash,
                    LineConstructionImage.line_construction_id: line_id
                }
                if existing_image is not None:
                    line_image['id'] = existing_image.id
                    
                insrt_stmt = insert(LineConstructionImage).values(line_image)
                upsert_stmt = insrt_stmt.on_conflict_do_update(
                    index_elements=[LineConstructionImage.id],
                    set_={
                        LineConstructionImage.image: insrt_stmt.excluded.image,
                        LineConstructionImage.image_hash: insrt_stmt.excluded.image_hash,
                        LineConstructionImage.line_construction_id: insrt_stmt.excluded.line_construction_id
                    }
                )
                await self.session.execute(upsert_stmt)

            await self.session.commit()
            result = (await self.session.execute(
                select(LineConstruction).where(
                    LineConstruction.uuid == data.uuid
                )
            )).scalar_one()
            return {
                "uuid": result.uuid,
                "is_synced": result.is_synced,
                "datetime_synced": result.datetime_synced.astimezone(timezone("Asia/Manila")).strftime("%Y-%m-%d %I:%M %p")
            }
        except Exception as e:
            await self.session.rollback()
            raise
