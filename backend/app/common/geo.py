import exifread
from fastapi import UploadFile, Depends, HTTPException, status
from fractions import Fraction
from sqlalchemy import select
from sqlalchemy.ext.asyncio.session import AsyncSession
from ..modules.gis.franchise_area.model.boundary import Boundary
from ..modules.gis.franchise_area.schema.response_model import VerifiedLocation
from ..modules.gis.franchise_area.services.get_location import verifyLocation
from sqlalchemy.orm import selectinload
from geoalchemy2.functions import ST_SetSRID, ST_Point, ST_SRID, ST_Intersects
from geoalchemy2.elements import WKTElement

def dms_to_decimal(dms):
    deg = float(dms.values[0])
    min = float(dms.values[1]) / 60
    sec = float(Fraction(dms.values[2])) / 3600
    return deg + min + sec


async def extract_address_from_image(image:UploadFile, session: AsyncSession):
    try:
        exif = exifread.process_file(image.file)
        image_lat = dms_to_decimal(exif['GPS GPSLatitude'])
        image_lon = dms_to_decimal(exif['GPS GPSLongitude'])
        if exif['GPS GPSLatitudeRef'].values != 'N':
            image_lat = -image_lat
        if exif['GPS GPSLongitudeRef'].values != 'E':
            image_lon = -image_lon
        geometry = ST_SetSRID(ST_Point(image_lon, image_lat), 4326)
        location = (await session.execute(
            select(Boundary)
            .options(
                selectinload(Boundary.villages),
                selectinload(Boundary.municipal)
            )
            .where(ST_Intersects(Boundary.geom, geometry))
        )).scalar_one_or_none()
        if not location:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Selected Location Exceeds Franchise Area")
        return VerifiedLocation(
            village=location.villages.name,
            municipality=location.municipal.name,
            geom=WKTElement('POINT({} {})'.format(image_lon, image_lat), srid=4326)
        )
    except KeyError:
        return None
    except Exception as e:
        return None