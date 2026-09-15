from sqlalchemy import select
from fastapi import HTTPException, status, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from.....dependencies.db_session import get_session
from sqlalchemy.orm import selectinload
from sqlalchemy import func
from ..model.transformer import DistributionTransformer
from ...distribution_lines.models.secondary_lines import SecondaryLines
from ...consumer.model.service_drop import ServiceDrop
from ....gis.franchise_area.model.villages import Village
from ....gis.franchise_area.model.municipality import Municipality
from geoalchemy2.functions import ST_AsGeoJSON
import json


class GetServicesDT:
    def __init__(self, session: AsyncSession = Depends(get_session)):
        self.session = session

    async def get_distribution_transformer(self):
        try:
            
            
            stmt_number_of_connected_consumer = (
                select(
                    SecondaryLines.transformer_id,
                    func.count(ServiceDrop.id).label("number_of_connected_consumer"),
                ).select_from(SecondaryLines)
                .join(ServiceDrop, onclause=SecondaryLines.to_bus.has(ServiceDrop.from_bus))
                .group_by(SecondaryLines.transformer_id)
            ).cte("number_of_connected_consumer")
            
            stmt = (
                select(
                    
                    DistributionTransformer.id,
                    DistributionTransformer.transformer_id,
                    ST_AsGeoJSON(DistributionTransformer.geom).label("geometry"),
                    DistributionTransformer.description,
                    DistributionTransformer.installation_type,
                    DistributionTransformer.primary_phasing,
                    DistributionTransformer.secondary_phasing,
                    DistributionTransformer.transformer_type,
                    DistributionTransformer.is_active,
                    Village.name.label("village"),
                    Municipality.name.label("municipality"),
                    func.coalesce(stmt_number_of_connected_consumer.c.number_of_connected_consumer, 0).label("number_of_connected_consumer"),
                )
                .select_from(DistributionTransformer)
                .join(DistributionTransformer.village)
                .join(DistributionTransformer.municipal)
                .join(stmt_number_of_connected_consumer,
                      onclause=stmt_number_of_connected_consumer.c.transformer_id == DistributionTransformer.transformer_id)
            ).cte("distribution_transformers")
            
            
            cte_construct_stmt = (
                select(stmt
            ))
            
            data = (await self.session.execute(cte_construct_stmt)).mappings().all()
        
            results ={"type": "FeatureCollection", "features":
                [
                {
                    "type": "Feature",
                    "geometry": json.loads(result["geometry"]),
                    "properties": {
                        "id": result["id"],
                        "transformer_id": result["transformer_id"],
                        "transformer_type": result["transformer_type"],
                        "description": result["description"],
                        "installation_type": result['installation_type'],
                        "primary_phasing": result["primary_phasing"],
                        "secondary_phasing": result["secondary_phasing"],
                        "is_active": result["is_active"],
                        "color": "#1c2986" if result["is_active"] else "#424242",
                        "village": result["village"],
                        "municipality": result["municipality"],
                        "connected_consumer": result["number_of_connected_consumer"],
                    },
                
                }
                for result in data]}    
            return results
        except Exception as e:
            print(e.__cause__ or e)