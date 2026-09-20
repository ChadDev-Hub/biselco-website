from sqlalchemy import select
from fastapi import HTTPException, status, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from.....dependencies.db_session import get_session
from sqlalchemy.orm import selectinload
from sqlalchemy import func
from ..model.transformer import DistributionTransformer, TransformerType
from ...distribution_lines.models.secondary_lines import SecondaryLines
from ...bus.model.bus import Bus
from ...consumer.model.service_drop import ServiceDrop
from ...consumer.model.consumer import ConsumerMeter
from ....gis.franchise_area.model.villages import Village
from ....gis.franchise_area.model.municipality import Municipality
from geoalchemy2.functions import ST_AsGeoJSON
import json


class GetServicesDT:
    def __init__(self, session: AsyncSession = Depends(get_session)):
        self.session = session
    # GET ALL DISTRIBUTION TRANSFORMER
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
                    TransformerType.kva_rating.label("kva_rating"),
                    TransformerType.primary_voltage_rating.label("primary_voltage_rating_kv"),
                    TransformerType.secondary_voltage_rating.label("secondary_voltage_rating_kv"),
                )
                .select_from(DistributionTransformer)
                .join(DistributionTransformer.village)
                .join(DistributionTransformer.municipal)
                .join(stmt_number_of_connected_consumer,
                      onclause=stmt_number_of_connected_consumer.c.transformer_id == DistributionTransformer.transformer_id)
                .join(TransformerType)
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
                        "primary_voltage_rating_kv": result["primary_voltage_rating_kv"],
                        "secondary_voltage_rating_kv": result["secondary_voltage_rating_kv"],
                        "kva_rating": result["kva_rating"],
                    },
                
                }
                for result in data]}
            print(results) 
            return results
        except Exception as e:
            print(e.__cause__ or e)
            
            
    # ===================== GET CONNECTED CONSUMERS =====================
    async def get_connected_consumers(self, transformer_id: str):
        try:
            stmt = (
                select(
                    ConsumerMeter.id,
                    ConsumerMeter.account_no,
                    ConsumerMeter.account_type, 
                    ConsumerMeter.account_name,
                    ConsumerMeter.meter_brand,
                    ConsumerMeter.meter_no,
                    Village.name.label("village"),
                    Municipality.name.label("municipality")
                )
                .select_from(ServiceDrop)
                .join(ConsumerMeter)
                .join(Village).join(Municipality)
                .join(SecondaryLines, onclause=SecondaryLines.to_bus.has(ServiceDrop.from_bus))
                .where(SecondaryLines.transformer_id == transformer_id)
            )
            data = (await self.session.execute(stmt)).mappings().all()
            
            parrent_x = 0
            parrent_y = 0
                        
            # create a LIST OF NODES
            node_id = 1
            nodes = [{
                "id": f"node-{node_id}",
                "type": "transformer",
                "position": {
                    "x": parrent_x,
                    "y": parrent_y
                },
                "data": {
                    "label": transformer_id,
                }
            }]
            
            
            row_size = 4
            row_increment = 2
            
            node_width = 150
            node_gap = 50
            # CONSUMERS
            for _,result in enumerate(data):
                
                row = 0
                remaining = _
                current_row_size = row_size
                parrent_y = 200
                while remaining >= current_row_size:
                    remaining -= current_row_size
                    row += 1
                    current_row_size += row_increment
            
                node_id += 1
                
                position_in_row = remaining
                
                total_width = current_row_size * node_width + (current_row_size - 1) * node_gap
                
                start_x = parrent_x - (total_width / 2)
                x = start_x + position_in_row * (node_width + node_gap)

                y = parrent_y + (row * 200)
                
                consumer_nodes = {
                    "id": f"node-{node_id}",
                    "type": "consumer",
                    "position": {
                        "x": x,
                        "y": y
                    },
                    "data": {
                        "id": result["id"],
                        "account_no": result["account_no"],
                        "account_type": result["account_type"],
                        "account_name": result["account_name"],
                        "meter_brand": result["meter_brand"],
                        "meter_no": result["meter_no"],
                    }
                }
                nodes.append(consumer_nodes)
            edges = [
                {
                    "id": f"edge-{_}",
                    "source": f"node-1",
                    "target": n['id']
                }
                for _,n in enumerate(nodes) if n['type'] == 'consumer'
            ]
            
            return {
                "nodes": nodes,
                "edges": edges
            }
        except Exception as e:
            print(e.__cause__ or e) 
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Something went wrong")