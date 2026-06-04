from sqlalchemy import select
from fastapi import HTTPException, status, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from.....dependencies.db_session import get_session
from sqlalchemy.orm import selectinload
from ..model.transformer import DistributionTransformer
from ....gis.franchise_area.model.villages import Village
from ....gis.franchise_area.model.municipality import Municipality
from geoalchemy2.functions import ST_AsGeoJSON
import json


class GetServicesDT:
    def __init__(self, session: AsyncSession = Depends(get_session)):
        self.session = session

    async def get_distribution_transformer(self):
        try:
            stmt = (
                select(
                    DistributionTransformer.id,
                    DistributionTransformer.transformer_id,
                    ST_AsGeoJSON(DistributionTransformer.geom).label("geometry"),
                    DistributionTransformer.transformer_type,
                    DistributionTransformer.is_active,
                    Village.name.label("village"),
                    Municipality.name.label("municipality"),
                )
                .join(DistributionTransformer.village)
                .join(DistributionTransformer.municipal)
            )
            data = (await self.session.execute(stmt)).mappings().all()
            results ={"type": "FeatureCollection", "features":
                [
                {
                    "type": "Feature",
                    "geometry": json.loads(result["geometry"]),
                    "properties": {
                        "id": result["id"],
                        "transformer_id": result["transformer_id"],
                        "transformer_type": result["transformer_type"],
                        "is_active": result["is_active"],
                        "color": "#1c2986" if result["is_active"] else "#424242",
                        "village": result["village"],
                        "municipality": result["municipality"],
                    },
                
                }
                for result in data]}    
            return results
        except Exception as e:
            print(e.__cause__ or e)