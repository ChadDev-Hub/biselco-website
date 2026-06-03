from ..models.primary_lines import PrimaryLines
from .....dependencies.db_session import get_session
from ...franchise_area.model.municipality import Municipality
from ...franchise_area.model.villages import Village
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status, Depends
from sqlalchemy import select, func
from geoalchemy2.functions import ST_AsGeoJSON
import json

class DistributionLineGetServices:
    def __init__(self, session: AsyncSession = Depends(get_session)):
        self.session: AsyncSession = session

    async def get_primary_lines(self):
        try:
            stmt = (select
                    (
                        ST_AsGeoJSON(PrimaryLines.geom).label("geometry"),
                        PrimaryLines.primary_line_id,
                        Village.name.label("village"),
                        Municipality.name.label("municipality"),
                        PrimaryLines.is_active,
                        func.round(PrimaryLines.length_meters, 2).label("length_meters"),
                        PrimaryLines.phasing,
                    ).join(PrimaryLines.village)
                    .join(PrimaryLines.municipal))
            result = (await self.session.execute(stmt)).mappings().all()
            data = {
                "type": "FeatureCollection",
                "features":
                [{
                    "type": "Feature",
                    "geometry": json.loads(res["geometry"]),
                    "properties": {
                        "primary_line_id": res["primary_line_id"],
                        "village": res["village"],
                        "municipality": res["municipality"],
                        "is_active": res["is_active"],
                        "color": "#1c2986" if res["is_active"] else "#424242",
                        "length_meters": res["length_meters"],
                        "phasing": res["phasing"]},
                        
                    } for res in result]}
            return data
        except Exception as e:
            print(e)