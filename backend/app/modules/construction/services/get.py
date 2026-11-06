from sqlalchemy import select, func
from sqlalchemy.orm import selectinload, load_only, joinedload
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import Depends
from ....dependencies.db_session import get_session
from ...gis.franchise_area.model.villages import Village
from ...gis.franchise_area.model.municipality import Municipality
from ..model.construction import Construction, ManpowerStatus, LineConstruction, AttendanceStatus, LineConstructionImage
from ...gis.wires.model.conductor_wires import ConductorWires
from ...gis.wires.model.conductor_wires import NeutralConcentricCable

from geoalchemy2.functions import ST_AsGeoJSON


class GetServices:
    def __init__(self, session: AsyncSession = Depends(get_session)):
        self.session = session

    async def get_line_construction(self):
        stmt = (
            select(
                Construction
            ).options(
                load_only(
                    Construction.id,
                    Construction.activity,
                    Construction.description,
                    Construction.date_accomplished
                ),
                selectinload(Construction.lines).options(
                    selectinload(LineConstruction.images).load_only(
                        LineConstructionImage.image
                    ),  
                    load_only(
                        LineConstruction.id,
                        LineConstruction.line_type,
                        LineConstruction.phasing,
                        LineConstruction.pole_assembly,
                        LineConstruction.date,
                        LineConstruction.pct_acc
                    ).with_expression(
                        LineConstruction.geometry,
                        ST_AsGeoJSON(LineConstruction.geometry)
                    ),
                    joinedload(LineConstruction.village).load_only(
                        Village.name,
                    ),
                    joinedload(LineConstruction.municipal).load_only(
                        Municipality.name
                    ),
                    joinedload(LineConstruction.conductor_wire).load_only(
                        ConductorWires.name,
                    ),
                    joinedload(LineConstruction.neutral_wire).load_only(
                        NeutralConcentricCable.name
                    )
                ),
                selectinload(Construction.manpower_status).options(
                    load_only(
                      ManpowerStatus.id,
                      ManpowerStatus.assigned_personnel,
                      ManpowerStatus.reason_of_absence  
                    ),
                    joinedload(ManpowerStatus.attendance_status)
                    .load_only(
                        AttendanceStatus.id,
                        AttendanceStatus.status
                    )
                )
            )
        )
        result = (await self.session.execute(stmt)).scalars().all()
        # CLEANING AND PROCESSING DATA
        cleaned_result = [
            {
                "construction": {
                    'id': r.id,
                    'activity': r.activity,
                    'description': r.description,
                    'date_accomplished': r.date_accomplished,
                    'manpower_status': [
                        {
                            'id': m.id,
                            'assigned_personnel': m.assigned_personnel,
                            'reason_of_absence': m.reason_of_absence,
                            'attendance_status': {
                                'id': m.attendance_status.id,
                                'status': m.attendance_status.status
                            }
                        }
                        for m in r.manpower_status
                    ],
                    'feature_collection': {
                        'type': 'FeatureCollection',
                        'features': [
                            {
                                'type': 'Feature',
                                'geometry': line.geometry,
                                'properties': {
                                    'id': line.id,
                                    'line_type': line.line_type,
                                    'phasing': line.phasing,
                                    'pole_assembly': line.pole_assembly,
                                    'date': line.date,
                                    'pct_acc': line.pct_acc,
                                    'village': line.village.name,
                                    'municipal':line.municipal.name,
                                    'conductor_wire': line.conductor_wire.name,
                                    'neutral_wire': line.neutral_wire.name,
                                    'image': [image.image for image in line.images][0]
                                }
                            }
                            for line in r.lines
                        ]
                    }
                }
            }
            for r in result]
        
        print(cleaned_result)
        return cleaned_result
